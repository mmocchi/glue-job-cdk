import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3_deployment from "aws-cdk-lib/aws-s3-deployment";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import { execSync } from 'child_process';


export class SampleEtlStack extends cdk.Stack {

  private buildGlueApp(): void {
    const buildCommand = 'uv run task build_wheel';
    execSync(buildCommand, { cwd: '../glue-app', stdio: 'inherit' });
  }

  private createRequirementsTxt(): string {
    const createCommand = 'uv pip compile pyproject.toml --extra awsglue4 -o /tmp/requirements.txt';
    execSync(createCommand, { cwd: '../glue-app', stdio: 'inherit' });
    return '/tmp/requirements.txt';
  }

  private parseRequirementsTxt(requirementsFilePath: string): string[] {
    const requirementsTxt = requirementsFilePath;
    const requirements = execSync(`cat ${requirementsTxt}`).toString().split('\n');

    // trim
    requirements.forEach((line, index) => {
      requirements[index] = line.trim();
    });

    // コメント行を除去
    const commentPattern = /^#.*$/;
    return requirements.filter((line) => !commentPattern.test(line));    
  }

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.buildGlueApp();

    // requirements.txtを作成
    const requirementsTxtPath = this.createRequirementsTxt();
    const requirements = this.parseRequirementsTxt(requirementsTxtPath);
  
    // GlueJobのエントリーポイントとなるスクリプトを配置するためのS3バケットを作成
    const glueAppScriptBucket = new s3.Bucket(
      this,
      "GlueJobScriptBucket", {
      bucketName: "glue-app-script-bucket",
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // GlueJobのライブラリを配置するためのS3バケットを作成
    const glueAppModuleBucket = new s3.Bucket(
      this,
      "GlueJobModuleBucket", {
      bucketName: "glue-app-module-bucket",
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Glue JobのスクリプトファイルをS3バケットにアップロード
    new s3_deployment.BucketDeployment(this, "ScriptDeployment", {
      sources: [s3_deployment.Source.asset('../glue-app/src')],
      destinationBucket: glueAppScriptBucket,
      memoryLimit: 256,
      destinationKeyPrefix: "src",
    });

    // GlueJobのライブラリを配置するためのS3バケットにアップロード
    new s3_deployment.BucketDeployment(this, "PackageDeployment", {
      sources: [s3_deployment.Source.asset("../glue-app/dist")],
      destinationBucket: glueAppModuleBucket,
      memoryLimit: 256,
      destinationKeyPrefix: "modules",
    });

    // Glue Job用のIAMロールを作成
    const glueJobRole = new iam.Role(this, 'GlueJobRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    });

    // S3バケットへのアクセス権限をIAMロールに付与
    glueJobRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        's3:GetObject',
        's3:PutObject',
        's3:ListBucket'
      ],
      resources: [
        glueAppScriptBucket.bucketArn,
        `${glueAppScriptBucket.bucketArn}/*`,
        glueAppModuleBucket.bucketArn,
        `${glueAppModuleBucket.bucketArn}/*`
      ],
    }));

    // CloudWatch Logsへのアクセス権限をIAMロールに付与
    glueJobRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents'
      ],
      resources: [
        "arn:aws:logs:*:*:*:/aws-glue/*",
        "arn:aws:logs:*:*:*:/customlogs/*"
      ],
    }));

    // Glue Jobに指定するモジュールの一覧
    const extraPyFiles = [
      `s3://${glueAppModuleBucket.bucketName}/modules/glue_app-0.1.0-py3-none-any.whl`,
    ];

    new glue.CfnJob(this, 'sampleEtlJob', {
      name: 'sampleEtlJob',
      role: glueJobRole.roleArn,
      command: {
        name: 'glueetl',
        scriptLocation: `s3://${glueAppScriptBucket.bucketName}/src/glue_app/jobs/sample.py`,
        pythonVersion: '3',
      },
      glueVersion: '4.0',
      numberOfWorkers: 2,
      workerType: 'G.1X',
      defaultArguments: {
        '--extra-py-files': extraPyFiles.join(','),
        '--additional-python-modules': requirements.join(',')
      }
    });
  }
}