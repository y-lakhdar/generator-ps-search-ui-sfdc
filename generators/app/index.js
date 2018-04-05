

'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const askName = require('inquirer-npm-name');
const _ = require('lodash');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const yosay = require('yosay');
const utils = require('../../utils');

module.exports = class extends Generator {

    initializing() {
        this.props = {};
    }

    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the fabulous ' + chalk.red('ps-search-ui-sfdc') + ' generator!'
        ));

        const prompts = [{
            type: 'input',
            name: 'customer',
            message: 'Your customer(project) name?',
            default: path.basename(process.cwd())
        }, {
            name: 'description',
            message: 'Description',
            when: !this.props.description
        }, {
            name: 'authorEmail',
            message: "Author's Email",
            when: !this.props.authorEmail,
            default: this.user.git.email(),
            store: true
        }, {
            name: 'authorName',
            message: "Author's Name",
            when: !this.props.authorName,
            default: this.user.git.name(),
            store: true
        }, {
            name: 'keywords',
            message: 'Package keywords (comma to split)',
            when: !this.props.keywords,
            filter(words) {
                return _.compact(words.split(/\s*,\s*/g));
            }
        }, {
            type: 'list',
            name: 'sourceControl',
            message: "Source Control",
            when: !this.props.sourceControl,
            default: 'Git',
            choices: ['Git', 'Mercurial']
        }];

        return this.prompt(prompts).then(function (props) {
            this.props = props;
            this.props.repoName = utils.makeRepoName(this.props.customer);
            // this.props.customerSafeName = _.snakeCase(this.props.customer);
            this.props.customerSafeName = _.camelCase(this.props.customer);
        }.bind(this));

    }

    default () {
        if (path.basename(this.destinationPath()) !== this.props.repoName) {
            this.log(
                'You must be inside a folder named ' + this.props.repoName + '\n' +
                'I\'ll automatically create this folder.'
            );
            mkdirp(this.props.repoName);
            this.destinationRoot(this.destinationPath(this.props.repoName));
        }
        const readmeTpl = _.template(this.fs.read(this.templatePath('README.md')));

        this.composeWith(require.resolve('../config'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../typescript'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../sass'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../routes'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../image'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../fonts'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../vendor'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../views'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../sfdc'), {
            customer: this.props.customer
        });

        this.composeWith(require.resolve('../utils'), {
            customer: this.props.customer
        });
    }

    writing() {
        const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        const templatePkg = this.fs.readJSON(this.templatePath('package.json'), {});
        const templateObj = {
            customerSafeName: this.props.customerSafeName,
            capitalizeCustomerSafeName: this.props.customerSafeName.replace(/\b\w/g, l => l.toUpperCase())
        }

        extend(pkg, {
            version: templatePkg.version,
            main: templatePkg.main,
            description: this.props.description,
            engines: templatePkg.engines,
            keywords: (templatePkg.keywords).concat(this.props.keywords),
            dependencies: templatePkg.dependencies,
            devDependencies: templatePkg.devDependencies,
            author: {
                name: this.props.authorName,
                email: this.props.authorEmail
            },
            scripts: templatePkg.scripts,
            "lint-staged": templatePkg["lint-staged"]
        });

        // overwrite default scripts by template ones

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);

        // Copy ignore file
        this.fs.copyTpl(
            this.templatePath('ignore'),
            this.destinationPath(this.props.sourceControl == 'Git'? '.gitignore': '.hgignore'),
            templateObj
        );

        // Copy all dotfiles
        this.fs.copyTpl(
            this.templatePath('.*'),
            this.destinationRoot()
        );

        // gulp tasks
        this.fs.copyTpl(
            this.templatePath('gulpTasks/*'),
        this.destinationPath('gulpTasks'),
            templateObj
        );

        // typescript configuration
        this.fs.copyTpl(
            this.templatePath('tsconfig.json'),
            this.destinationPath('tsconfig.json'),
            templateObj
        );
        // typescript configuration
        this.fs.copyTpl(
            this.templatePath('tslint.json'),
            this.destinationPath('tslint.json'),
            templateObj
        );

        // webpack
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js'),
            templateObj
        );

        this.fs.copyTpl(
            this.templatePath('webpack.sass.js'),
            this.destinationPath('webpack.sass.js'),
            templateObj
        );

        // passports.js
        this.fs.copyTpl(
            this.templatePath('passports.js'),
            this.destinationPath('passports.js'),
            templateObj
        );

        // server.js
        this.fs.copyTpl(
            this.templatePath('server.js'),
            this.destinationPath('server.js'),
            templateObj
        );

        // below files are required for azure deployment
        // TODO: add options in yeoman to prompt question if this project will be deployed to azure or not
        // this.fs.copyTpl(
        //     this.templatePath('web.config'),
        //     this.destinationPath('web.config'),
        //     templateObj
        // );
        // this.fs.copyTpl(
        //     this.templatePath('iisnode.yml'),
        //     this.destinationPath('iisnode.yml'),
        //     templateObj
        // );
    }

    install() {
        this.log(this.props);
        // make sure to overwrite gulpfile with our template before installation.
        const templateObj = {
            customerSafeName: this.props.customerSafeName,
            capitalizeCustomerSafeName: this.props.customerSafeName.replace(/\b\w/g, l => l.toUpperCase())
        }
        // gulpfile
        this.fs.copyTpl(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js'),
            templateObj
        );
        if (!this.option.skipInstall) {
            this.npmInstall();
        }
        // this.installDependencies({bower: false});
    }

    end() {

    }
};