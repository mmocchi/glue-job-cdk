import sys
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.dynamicframe import DynamicFrame
from awsglue.job import Job
from pyspark.sql.functions import col
import pandera as pa
from pandera.typing.pyspark import DataFrame
from pandera.pyspark import DataFrameModel, Field
from pyspark.sql.types import StringType, LongType

from glue_app.schemes.schema import InputDataScheme, OutputDataScheme
from glue_app.common.func import translate



@pa.check_types
def get_input_df() -> DataFrame[InputDataScheme]:
    print("start get_input_df")
    input_sdf = glue_context.spark_session.createDataFrame(
        [
            [1, "test1", 10, 20],
            [2, "test2", 20, 30],
            [3, "test3", 10, 40],
        ],
        [
            "a",
            "b",
            "c",
            "d",
        ],
    )
    return input_sdf

def save_output_df(output_df: DataFrame[OutputDataScheme]):
    print("start save_output_df")
    output_dyn = DynamicFrame.fromDF(output_df, glue_context, "output")
    glue_context.write_dynamic_frame.from_options(
        frame=output_dyn,
        connection_options={"path": "s3://some-bucket/parquet"},
        connection_type="s3",
        format="parquet",
    )


def main():
    input_df = get_input_df()
    output_df = translate(input_df)
    save_output_df(output_df)


if __name__ == "__main__":
    args = getResolvedOptions(sys.argv, ["JOB_NAME"])
    sc = SparkContext()
    sc._jsc.hadoopConfiguration().set("fs.s3a.endpoint", "http://s3.dev:4566")
    sc._jsc.hadoopConfiguration().set("fs.s3a.path.style.access", "true")
    sc._jsc.hadoopConfiguration().set("fs.s3a.signing-algorithm", "S3SignerType")
    sc._jsc.hadoopConfiguration().set("fs.s3a.change.detection.mode", "None")
    sc._jsc.hadoopConfiguration().set(
        "fs.s3a.change.detection.version.required", "false"
    )
    glue_context = GlueContext(sc)

    job = Job(glue_context)
    job.init(args["JOB_NAME"], args)

    main()

    job.commit()
    print("Job completed!!!")
