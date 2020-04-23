#!/bin/sh

apk add --no-cache bash

bash ./scripts/waitForIt/main.sh 127.0.0.1:5432 -- echo " === Postgres is available === "
node ./src/config/postgres.js
NODE_ENV=development node node_modules/.bin/sequelize db:migrate
NODE_ENV=test node node_modules/.bin/sequelize db:migrate
npm run db:seeds

if [ "$NODE_ENV" == "production" ] ; then
  npm run prod
else
  npm run dev
fi
