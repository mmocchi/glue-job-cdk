import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Define a new python lambda function
    new PythonFunction(this, 'helloFunction', {
      functionName: 'helloFunction',
      runtime: cdk.aws_lambda.Runtime.PYTHON_3_11,
      entry: '../app1/src/lambda/hello',
      handler: 'handler',
    })
  }
}
