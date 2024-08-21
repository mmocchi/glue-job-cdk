# glue-app

## setup
```
poetry install
```


## ローカル実行

### Dockerを起動する
```
$ docker compose up --build -d
```

### Glue Jobを実行する

コンテナの中に入る
```
$ docker compose exec -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev bash
```

Glue Jobの実行
```
aws s3 mb s3://some-bucket --endpoint-url http://s3.dev:4566
aws s3 ls --endpoint-url http://s3.dev:4566
aws s3 ls s3://some-bucket --endpoint-url http://s3.dev:4566
glue-spark-submit src/glue_app/jobs/sample.py --REGION=ap-northeast-1 --JOB_NAME=sampleEtlJob
```

### Dockerを停止する
```
$ docker compose stop
```

## 単体テスト実行

### Dockerを起動する
```
$ docker compose up --build -d
```

### pytestを実行する
```
$ docker compose exec -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev /home/glue_user/.local/bin/pytest --cov=src tests
```

### 特定のtestファイルに対してpytestを実行する
```
$ docker compose exec -u glue_user -w /home/glue_user/workspace/jupyter_workspace glue.dev /home/glue_user/.local/bin/pytest tests/test_sample.py
```

### Dockerを停止する
```
$ docker compose stop
```

## build(generate whl)
```
poetry build
```
