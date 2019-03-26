# ベースイメージを指定
# 今回は LTS の 8.9.4 にする
# alpine は 軽量の linux OS
#FROM node:10.15.3-alpine

# node.js の環境変数を定義する
# 本番環境では production

#COPY . /app
#WORKDIR /app

# 雛形を生成するのに必要なパッケージのインストール
#RUN npm install

# ポート3000番を開放する
#EXPOSE 8085

#CMD ["npm", "run", "serve"]

FROM node:10
COPY ./ /app
WORKDIR /app
RUN npm install && npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY keys /root/certs
COPY nginx.conf /etc/nginx/nginx.conf
