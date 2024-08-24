import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as athena from 'aws-cdk-lib/aws-athena';
import { Construct } from 'constructs';

export class AthenaWorkgroupStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // バケット名を定義
        const bucketName = `athena-results-${this.account}`;

        // S3バケットを作成
        const athenaResultsBucket = new s3.Bucket(this, 'AthenaResultsBucket', {
            bucketName: bucketName,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            autoDeleteObjects: false,
            versioned: true,
            lifecycleRules: [
                {
                    expiration: cdk.Duration.days(90),
                },
            ],
        });

        // AthenaがS3バケットにアクセスするためのIAMポリシー
        const athenaAccessPolicy = new iam.PolicyStatement({
            actions: [
                's3:GetBucketLocation',
                's3:GetObject',
                's3:ListBucket',
                's3:PutObject'
            ],
            resources: [
                athenaResultsBucket.bucketArn,
                `${athenaResultsBucket.bucketArn}/*`
            ]
        });

        // Athena用のカスタムIAMロールを作成
        const athenaRole = new iam.Role(this, 'AthenaCustomRole', {
            assumedBy: new iam.ServicePrincipal('athena.amazonaws.com'),
            description: 'Custom role for Athena operations',
        });

        // ポリシーをロールにアタッチ
        athenaRole.addToPolicy(athenaAccessPolicy);

        // 新しいAthenaワークグループを作成
        const myWorkGroup = new athena.CfnWorkGroup(this, 'MyAthenaWorkGroup', {
            name: 'cdk-managed-workgroup',
            description: 'Athena workgroup managed by CDK',
            workGroupConfiguration: {
                resultConfiguration: {
                    outputLocation: `s3://${athenaResultsBucket.bucketName}/`,
                    encryptionConfiguration: {
                        encryptionOption: 'SSE_S3'
                    }
                },
                publishCloudWatchMetricsEnabled: true,
                enforceWorkGroupConfiguration: true,
                bytesScannedCutoffPerQuery: 1000000000, // 1GB
                requesterPaysEnabled: false
            },
            state: 'ENABLED'
        });


        // 出力の設定
        new cdk.CfnOutput(this, 'MyAthenaWorkgroupName', {
            value: myWorkGroup.name,
            description: 'The name of the new Athena Workgroup',
            exportName: 'MyAthenaWorkgroupName'
        });

        new cdk.CfnOutput(this, 'AthenaResultsBucketName', {
            value: athenaResultsBucket.bucketName,
            description: 'The name of the S3 bucket for Athena query results',
            exportName: 'AthenaResultsBucketName'
        });

        new cdk.CfnOutput(this, 'AthenaCustomRoleName', {
            value: athenaRole.roleName,
            description: 'The name of the custom IAM role for Athena',
            exportName: 'AthenaCustomRoleName'
        });
    }
}