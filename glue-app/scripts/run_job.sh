# Glue Jobをローカルで実行するためのスクリプト

# S3バケットの準備
docker compose exec -T -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev aws s3 mb s3://some-bucket --endpoint-url http://s3.dev:4566
docker compose exec -T -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev aws s3 ls s3://some-bucket --endpoint-url http://s3.dev:4566

# Glue Jobの実行
docker compose exec -T -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev /home/glue_user/spark/bin/spark-submit src/glue_app/jobs/sample.py --REGION=ap-northeast-1 --JOB_NAME=sampleEtlJob

# S3バケットの確認
docker compose exec -T -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev aws s3 ls s3://some-bucket --endpoint-url http://s3.dev:4566
docker compose exec -T -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev aws s3 ls s3://some-bucket/parquet/ --endpoint-url http://s3.dev:4566
