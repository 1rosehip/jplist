REM node app.js
REM npm start
supervisor -w app.js,package.json,views,routes,public -e js,html,json ./bin/www