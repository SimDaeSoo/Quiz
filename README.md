# Template
Default template of creating basic web service

## Service Port Info
- 80 Port - NginX Server  
- 1337 Port - StrAPI Server  
- 3000 Port - Next.js Server  
- 27017 Port - MongoDB Server  

## How To Run
### Mac OSX & Linux
```shell
$ docker-compose up -d mongo
$ docker-compose exec mongo mongo mongodb://localhost:27017 -u root -p password --eval "rs.initiate()"
$ docker-compose build
$ docker-compose up
$ docker-compose run strapi bash -c "yarn cli setup"
```  

## Development Documents
- Docker - <https://www.docker.com/>  
- NginX - <https://www.nginx.com/>  
- StrAPI - <https://strapi.io/>  
- Next.js - <https://nextjs.org/>  
- MongoDB - <https://www.mongodb.com/>  
