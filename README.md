[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

# Hygisoft-web-API

API GraphQL de Hygisoft version web

## Install
```
git clone https://github.com/defi-informatique-team/Hygisoft-web-API.git
cd Hygisoft-web-API
npm install
```

## Test
```
npm test
```

## Developpement
Launch a mariadb database container 
```
docker run --name some-mariadb -p 3306:3306 -e  MYSQL_ROOT_PASSWORD=my-secret-pw -d mariadb
```
Fill your database
```
NODE_ENV=development npm run sequelize db:seed:all
```
Empty your database
```
NODE_ENV=development npm run sequelize db:seed:undo:all
```
Launch you application
```
NODE_ENV=development npm run watch
```
Don't forget development environment variable else connexion database and GraphiQL will not working. You can create a .env file in the root directory of this project and adding development environment variable like this : `NODE_ENV=development`
