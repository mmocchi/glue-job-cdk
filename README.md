# glue-job-cdk
下記を前提にGlue Jobの開発環境整備を試すリポジトリ

* AWS Glue Job 4.0
* PySpark
* LocalStackとGlue Jobのコンテナによるローカル実行、単体テスト実行
* pandoraによる実行時型チェック
* CDKによるデプロイ


## デプロイ
```
cd glue-job
poetry build

cd ../hello-cdk
cdk deploy
```


## 参考
https://github.com/n-yokota/aws_glue_test_concept

https://zenn.dev/shuntaka/scraps/bd6adab165f2d9

https://qiita.com/sai2-dev/items/0796280cb7b28876d134


## TODO
* spark.confの外だし
* pandera含むデプロイ
* 共通モジュール使ったローカル実行
* 共有モジュール含むデプロイ
* GitHub ActionsによるCI/CD