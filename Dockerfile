# ベースイメージを指定
# 今回は LTS の 8.9.4 にする
# alpine は 軽量の linux OS
FROM node:8.15.1-alpine

# node.js の環境変数を定義する
# 本番環境では production

COPY . /app
WORKDIR /app

RUN apk --update add python
RUN apk add make
RUN apk add g++
RUN apk add git

# 雛形を生成するのに必要なパッケージのインストール
RUN npm install

# ポート3000番を開放する
EXPOSE 2000

CMD ["npm", "start"]
