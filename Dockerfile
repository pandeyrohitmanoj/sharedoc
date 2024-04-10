FROM node:18

ENV \
    NEXT_PUBLIC_BACKEND="https://gcd-server-yqmtcbehnq-el.a.run.app"
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run dev
