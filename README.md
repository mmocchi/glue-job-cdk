# glue-job-cdk
下記を前提にGlue Jobの開発環境整備を試すリポジトリ

* AWS Glue Job 4.0
* PySpark
* LocalStackとGlue Jobのコンテナによるローカル実行、単体テスト実行
* pandoraによる実行時型チェック
* CDKによるデプロイ
* Glueアプリケーションのソースコードの構造化
* Glue DataCatalogでDataLake内のデータを定義
* AthenaでData Catalog内のデータを確認できるように


## デプロイ
```
npm run deploy
```


## 参考
https://github.com/n-yokota/aws_glue_test_concept

https://zenn.dev/shuntaka/scraps/bd6adab165f2d9

https://qiita.com/sai2-dev/items/0796280cb7b28876d134

https://dev.classmethod.jp/articles/cdk-glue-python-shell-custom-functions/


## TODO
* GlueJobのデータソースと書き込み先をDataCatalogで作ったS3にする(CDK、ソースコード)
* Spark UIの有効化
* Data Qualityを試してみたい
* GitHub ActionsによるCI/CD