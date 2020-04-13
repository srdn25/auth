#!/bin/sh

apk add --no-cache bash

bash ./scripts/waitForIt/main.sh 127.0.0.1:5432 -- echo " === Postgres is available === "
node ./src/config/postgres.js
npm run db:migrate

if [ "$NODE_ENV" == "production" ] ; then
  npm run prod
else
  npm run dev
fi
