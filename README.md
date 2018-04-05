# generator-ps-search-ui-sfdc

[![Build Status](https://travis-ci.org/jfallaire/generator-ps-search-ui-sfdc.svg?branch=master)](https://travis-ci.org/jfallaire/generator-ps-search-ui-sfdc) [![npm version](https://badge.fury.io/js/generator-ps-search-ui-sfdc.svg)](https://badge.fury.io/js/generator-ps-search-ui-sfdc)

> ps-search-ui-sfdc generator generating a nodejs module as development environment to interact with the Coveo JS Search UI framework

![Solutions Specialist, you've been served!](https://i.imgflip.com/1jaox9.jpg)


## Getting started

- Install: `npm install -g generator-ps-search-ui-sfdc`
- Run: `yo ps-search-ui-sfdc`


## Commands

* `yo ps-search-ui-sfdc` shows a wizard for generating a new nodejs module specific for a customer


## What do you get?

Scaffolds out a complete generator directory structure for you:

```
|-- <CustomerName>-search-ui
    |-- .editorconfig
    |-- .gitattributes
    |-- .gitignore
    |-- .travis.yml
    |-- LICENSE
    |-- README.md
    |-- gulpfile.js
    |-- package.json
    |-- tsconfig.json
    |-- webpack.config.js
    |-- config
    |   |-- config.development.js
    |   |-- config.global.js
    |   |-- config.production.js
    |   |-- index.js
    |-- gulpTasks
    |   |-- compile.js
    |   |-- css.js
    |   |-- dev.js
    |   |-- setup.js
    |-- sass
    |   |-- AgentBox.scss
    |   |-- AgentFullSearch.scss
    |   |-- CommunityFullSearch.scss
    |-- src
    |   |-- Index.ts
    |   |-- custo
    |   |   |-- <CustomerName>Custo.ts
    |   |   |-- <CustomerName>Helper.ts
    |   |   |-- <CustomerName>Initialization.ts
    |   |-- events
    |   |   |-- CustomEvents.ts
    |   |-- ui
    |-- vendor
    |   |-- coveo
    |   |-- Box
    |   |   |-- css
    |   |   |   |-- CoveoBoxNew.css
    |   |   |-- js
    |   |       |-- CoveoJsSearch_Box.d.ts
    |   |       |-- CoveoJsSearch_Box.js
    |   |       |-- templates
    |   |           |-- All.js
    |   |           |-- Chatter.js
    |   |           |-- Dropbox.js
    |   |           |-- Email.js
    |   |           |-- GoogleDrive.js
    |   |           |-- Jira.js
    |   |           |-- Lithium.js
    |   |           |-- People.js
    |   |           |-- Salesforce.js
    |   |           |-- SharePoint.js
    |   |           |-- YouTube.js
    |   |           |-- box.new.templates.js
    |   |-- resources
    |       |-- css
    |       |-- gulpTasks
    |       |-- img
    |       |-- js
    
    |-- views
        |-- pages
        |   |-- agent-box.ejs
        |   |-- agent-full-search.ejs
        |   |-- community-search.ejs
        |-- partials
        |-- templates

```

Refer to [our documentation](http://yeoman.io/authoring/) to learn more about creating a Yeoman generator.
