FROM amazon/aws-glue-libs:glue_libs_4.0.0_image_01

# switch user to use yum command
USER root
RUN yum update -y && yum install -y jq

# switch user for security
USER glue_user

WORKDIR /home/glue_user/workspace/jupyter_workspace
ENV PYTHONPATH $PYTHONPATH:/home/glue_user/workspace/jupyter_workspace/src

COPY pyproject.toml /home/glue_user/workspace/jupyter_workspace/pyproject.toml
COPY README.md /home/glue_user/workspace/jupyter_workspace/README.md

RUN pip3 install --upgrade pip
RUN pip3 install uv
RUN python3 -m uv pip compile pyproject.toml --extra test --extra awsglue4 -o /tmp/requirements_dev_container.txt

# TODO: uv pip install --systemで入れたいがPermission deniedエラーが出るため、pip3を使ってインストール
RUN pip3 install -r /tmp/requirements_dev_container.txt

CMD ["/home/glue_user/jupyter/jupyter_start.sh"]