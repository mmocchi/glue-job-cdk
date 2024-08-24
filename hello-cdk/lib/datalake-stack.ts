import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as path from 'path';

interface ColumnDefinition {
    name: string;
    type: string;
}

interface TableDefinition {
    tableName: string;
    columns: ColumnDefinition[];
}

interface DatabaseDefinition {
    database: string;
    tables: {
        [key: string]: TableDefinition;
    };
}

interface TableDefinitions {
    [key: string]: DatabaseDefinition;
}

export class DataLakeStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // テーブル定義の読み込み
        const datalakeInputDefinitionsPath = path.join(__dirname, 'datalake-input-schemes.json');
        const datalekeInputTableDefinitions: TableDefinitions = JSON.parse(fs.readFileSync(datalakeInputDefinitionsPath, 'utf8'));
        const datalakeOutputDefinitionsPath = path.join(__dirname, 'datalake-output-schemes.json');
        const datalakeOutputTableDefinitions: TableDefinitions = JSON.parse(fs.readFileSync(datalakeOutputDefinitionsPath, 'utf8'));

        // S3バケットの作成
        const datalakeInputBucket = new s3.Bucket(this, 'DatalakeInputBucket', {
            bucketName: 'datalake-input-bucket',
            versioned: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
            autoDeleteObjects: false,
        });

        const datalakeOutputBucket = new s3.Bucket(this, 'DatalakeOutputBucket', {
            bucketName: 'datalake-output-bucket',
            versioned: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
            autoDeleteObjects: false,
        });

        // Glueデータベースとテーブルの作成
        // Input
        Object.entries(datalekeInputTableDefinitions).forEach(([domain, dbDef]) => {
            const database = new glue.CfnDatabase(this, `GlueInputDatabase${domain}`, {
                catalogId: this.account,
                databaseInput: {
                    name: dbDef.database,
                    description: `Input Database for ${domain} data`,
                },
            });

            Object.entries(dbDef.tables).forEach(([tableName, tableDef]) => {
                new glue.CfnTable(this, `GlueInputTable${domain}${tableName}`, {
                    catalogId: this.account,
                    databaseName: database.ref,
                    tableInput: {
                        name: tableDef.tableName,
                        description: `Input Table for ${domain} ${tableName} data`,
                        storageDescriptor: {
                            columns: tableDef.columns,
                            location: datalakeInputBucket.s3UrlForObject(`${domain}/${tableName}`),
                            inputFormat: 'org.apache.hadoop.mapred.TextInputFormat',
                            outputFormat: 'org.apache.hadoop.mapred.TextInputFormat',
                            serdeInfo: {
                                serializationLibrary: 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe',
                                parameters: { 'serialization.format': ',', 'field.delim': ',', 'timestamp.formats': 'yyyy-MM-dd HH:mm:ss', "skip.header.line.count": "1" },
                            },
                        },
                        tableType: 'EXTERNAL_TABLE',
                    },
                });
            });
        });

        // Output
        Object.entries(datalakeOutputTableDefinitions).forEach(([domain, dbDef]) => {
            const database = new glue.CfnDatabase(this, `GlueOutputDatabase${domain}`, {
                catalogId: this.account,
                databaseInput: {
                    name: dbDef.database,
                    description: `Oupput Database for ${domain} data`,
                },
            });

            Object.entries(dbDef.tables).forEach(([tableName, tableDef]) => {
                new glue.CfnTable(this, `GlueOutputTable${domain}${tableName}`, {
                    catalogId: this.account,
                    databaseName: database.ref,
                    tableInput: {
                        name: tableDef.tableName,
                        description: `Output Table for ${domain} ${tableName} data`,
                        storageDescriptor: {
                            columns: tableDef.columns,
                            location: datalakeOutputBucket.s3UrlForObject(`${domain}/${tableName}`),
                            inputFormat: 'org.apache.hadoop.mapred.TextInputFormat',
                            outputFormat: 'org.apache.hadoop.mapred.TextInputFormat',
                            serdeInfo: {
                                serializationLibrary: 'org.apache.hadoop.hive.serde2.OpenCSVSerde',
                                parameters: { 'separatorChar': ',', 'timestamp.formats': 'yyyy-MM-dd HH:mm:ss' },
                            },
                        },
                        tableType: 'EXTERNAL_TABLE',
                    },
                });
            });
        });
    }
}