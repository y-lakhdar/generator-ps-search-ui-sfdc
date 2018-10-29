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
* `gulp dev` -> use port 3000 for realtime changes
* `gulp compile` -> Build only the TypeScript code and generate its output in the `./bin` folder.
* `gulp sfdc` -&gt; Setup a bundle with all the requirements for Salesforce.
* `gulp sfdc --vf` -&gt; Compile only Visualforce Pages and Components for Salesforce.

## Compilation Settings
* `gulp dev --config` -> Set configuration (e.g.: development,uat,production)
* `gulp dev --filter` -> Override default filter expression (e.g.: @uri)
* `gulp dev --noFilter` -> This will prevent the filter to be added to the token
* `gulp dev --searchHub` -> Set the searchHub
* `gulp dev --pipeline` -> Set the pipeline

## How to run DEV on your local machine
* `gulp dev` -> http://localhost:3000

## How to run PRODUCTION your local machine
* `gulp dev --config production` -> http://localhost:3000

## How to open the search page with a different language
You can change the search page language by adding the `local` query parameter to the url. For instance, to load the search page in French, open
http://localhost:3001/support-search?local=fr

## Useful Links

General reference documentation is generated using TypeDoc (see
[Coveo JavaScript Search UI Framework - Reference Documentation](https://coveo.github.io/search-ui/)). The
generated reference documentation lists and describes all available options and public methods for each component.

A tutorial is available (see
[JavaScript Search Framework Getting Started Tutorial](https://developers.coveo.com/display/JsSearchV1/JavaScript+Search+Framework+V1+Getting+Started+Tutorial)).
If you are new to the Coveo JavaScript Search UI Framework, you should definitely consult this tutorial, as it contains
valuable information.