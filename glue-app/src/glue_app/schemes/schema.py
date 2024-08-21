from pandera.typing.pyspark import DataFrame
from pandera.pyspark import DataFrameModel, Field
from pyspark.sql.types import StringType, LongType

class InputDataScheme(DataFrameModel):
    a: LongType = Field()
    b: StringType = Field()
    c: LongType = Field()
    d: LongType = Field()

    class Config:
        strict = True


class OutputDataScheme(InputDataScheme):
    aaa: LongType = Field()

    class Config:
        strict = True
