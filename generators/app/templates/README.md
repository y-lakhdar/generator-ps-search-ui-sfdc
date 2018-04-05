# <%- repoName %>

This project is meant to display a working starting point for a SFDC project that wish to extend the [Coveo Javascript Search Framework](https://github.com/coveo/search-ui) with custom styling and additional components.

## Build
    npm install
    gulp

All resources will be available under `./bin` folder.

## Docker
We have setup a docker workflow with Nginx, Node.js and Redis. We are running Redis and node application independently as we want to have the ability to scale the node application dynamically using docker-compose command. If you decide to scale up your node service, Nginx-proxy server will adapt and will load balanced your node instances dynamically.

![Docker Architecture](https://cl.ly/3h1N3C372A3Z/download/Image%202018-02-12%20at%202.21.31%20PM.png)

### Build the app

    docker build --rm -f node.dockerfile -t <%- repoName %>:latest .

### Create and start containers

    docker-compose up -d --build --remove-orphans --scale node=3

Nginx service will dynamically setup a load balancer between the given number of node services you want to scale. This example will load balance 3 node services and all of them are linked to one Redis service (storing sessions)

### Create a local copy of <%- repoName %> docker image

    docker save <%- repoName %> > <%- repoName %>.tar

If we want to load that Docker container from the archive tar file :

    docker load --input <%- repoName %>.tar


## Important gulp tasks
* `gulp default` -> Build the whole project (CSS, templates, TypeScript, etc.) and generate its output in the `./bin` folder.
* `gulp build` -> same as default
* `gulp dev` -> use port 3001 for realtime changes
* `gulp compile` -> Build only the TypeScript code and generate its output in the `./bin` folder.
* `gulp bundle-sfdc` -> Bundle the content of the `./bin` folder in the `./zip` folder.

## Compilation Settings
* `gulp dev --config` -> Set configuration (e.g.: development,uat,production)
* `gulp dev --filterExpression` -> Override default filter expression (e.g.: @uri)
* `gulp dev --impersonateUser` -> Set user to impersonate (e.g.: --impersonateUser=user1@coveo.com or --impersonateUser="user1@coveo.com;user2@coveo.com" for multiple users)

## Tips n trick for developers on Windows
* `gulp;gulp prepareSfdc;gulp bundleSfdc;gulp deploySfdc` -&gt; build, prepare, bundle and deploy the SFDC project

## How to run DEV on your local machine
* `gulp dev --impersonateUser="someone@dev.somewhere.com"` -> http://localhost:3001

## How to run UAT on your local machine
* `gulp dev --config=uat --impersonateUser="someone@uat.somewhere.com"` -> http://localhost:3001

## How to run PRODUCTION your local machine
* `gulp dev --config=production --impersonateUser="someone@somewhere.com"` -> http://localhost:3001