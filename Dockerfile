FROM node:14.17.0

COPY . /
RUN apt-get -y update
RUN apt-get install -y git
RUN git clone https://github.com/vishnubob/wait-for-it.git
RUN cp wait-for-it/wait-for-it.sh /wait-for-it.sh
RUN npm i
RUN chmod +x /wait-for-it.sh


EXPOSE 3000