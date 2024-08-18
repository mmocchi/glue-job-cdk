FROM amazon/aws-glue-libs:glue_libs_4.0.0_image_01

# switch user to use yum command
USER root
RUN yum update -y && yum install -y jq

# switch user for security
USER glue_user

WORKDIR /home/glue_user/workspace/jupyter_workspace

COPY requirements_dev_container.txt /home/glue_user/workspace/jupyter_workspace/requirements_dev_container.txt

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements_dev_container.txt

CMD ["/home/glue_user/jupyter/jupyter_start.sh"]