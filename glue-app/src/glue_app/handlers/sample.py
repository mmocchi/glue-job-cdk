import sys
import boto3
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.dynamicframe import DynamicFrame
from awsglue.job import Job
from pyspark.sql.functions import col
from pyspark.sql.functions import to_date, split



args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glue_context = GlueContext(sc)

job = Job(glue_context)
job.init(args['JOB_NAME'], args)

job.commit()
print("Job completed!!!")