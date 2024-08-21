from pyspark.sql import SparkSession
from glue_app.jobs.sample import translate


def test_aaa(spark):
    assert 1 == 1


def test_translate(spark: SparkSession):
    input_sdf = spark.createDataFrame(
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

    output_df = translate(input_sdf)

    assert output_df.count() == 3
    assert output_df.columns == ["a", "b", "c", "d", "aaa"]
