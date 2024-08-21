import pandera as pa
from pandera.typing.pyspark import DataFrame
from pyspark.sql.functions import col
from glue_app.schemes.schema import InputDataScheme, OutputDataScheme

@pa.check_types
def translate(input_df: DataFrame[InputDataScheme]) -> DataFrame[OutputDataScheme]:
    print("start translate")
    return input_df.withColumn("aaa", col("c") * 2)