# mycdk

## test

### by docker
```
$ docker compose up --build
$ docker compose exec -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev bash
```

```
aws s3 mb s3://some-bucket --endpoint-url http://s3.dev:4566
aws s3 ls --endpoint-url http://s3.dev:4566
aws s3 ls s3://some-bucket --endpoint-url http://s3.dev:4566
glue-spark-submit src/glue_app/handlers/sample.py --REGION=ap-northeast-1 --JOB_NAME=sampleEtlJob
```

```
$ docker compose exec -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev /home/glue_user/.local/bin/pytest $1
```

## deploy
```
cdk deploy
```
