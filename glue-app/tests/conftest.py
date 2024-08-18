import pytest
from awsglue.context import GlueContext
from pyspark.sql import SparkSession


def _create_spark_session():
    return (
        SparkSession.builder.master("local[1]")
        .config("spark.sql.shuffle.partitions", "1")
        .config("spark.ui.showConsoleProgress", "false")
        .config("spark.ui.enabled", "false")
        .config("spark.ui.dagGraph.retainedRootRDD", "1")
        .config("spark.ui.retainedJobs", "1")
        .config("spark.ui.retainedStages", "1")
        .config("spark.ui.retainedTasks", "1")
        .config("spark.sql. ui.retainedExecutions", "1")
        .config("spark.worker.ui.retainedExecutors", "1")
        .config("spark.worker.ui.retainedDrivers", "1")
        .getOrCreate()
    )


@pytest.fixture(scope="session")
def glue_context():
    """
    テスト用の高速起動の設定を使ってglue_contextを作成する
    参考:
        https://medium.com/constructor-engineering/faster-pyspark-unit-tests-1cb7dfa6bdf6
    """
    spark_session = _create_spark_session()

    yield GlueContext(spark_session.sparkContext)
    spark_session.stop()


@pytest.fixture(scope="session")
def spark() -> SparkSession:
    """
    テスト用の高速起動の設定を使ってglue_contextを作成する
    参考:
        https://medium.com/constructor-engineering/faster-pyspark-unit-tests-1cb7dfa6bdf6
    """
    spark_session = _create_spark_session()

    yield spark_session
    spark_session.stop()
