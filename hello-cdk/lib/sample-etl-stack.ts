import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as glue_alpha from '@aws-cdk/aws-glue-alpha';

export class SampleEtlStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new glue_alpha.Job(this, 'sampleEtlJob', {
      jobName: 'sampleEtlJob',
      executable: glue_alpha.JobExecutable.pythonEtl({
        glueVersion: glue_alpha.GlueVersion.V4_0,
        pythonVersion: glue_alpha.PythonVersion.THREE,
        script: glue_alpha.Code.fromAsset('../glue-app/src/glue_app/jobs/sample.py'),
      }),
      workerType: glue_alpha.WorkerType.G_1X, 
      workerCount: 2,
    });
  }
}