'use strict';
const path = require('path');
const _ = require('lodash');
var mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('customer', {
            type: String,
            required: true,
            desc: 'Customer name'
        });
    }

    initializing() {
        this.props = {};
        this.props.customerName = this.options.customer;
        // this.props.customerSafeName = _.snakeCase(this.options.customer);
        this.props.customerSafeName = _.camelCase(this.options.customer);
    }

    writing() {
        const templateObj = {
          customerSafeName : this.props.customerSafeName,
          capitalizeCustomerSafeName : this.props.customerSafeName.replace(/\b\w/g, l => l.toUpperCase()),
        }

        // Custo
        this.fs.copyTpl(
          this.templatePath('src/custo/ProjectCusto.ts'),
          this.destinationPath(path.join('src', 'custo', templateObj.capitalizeCustomerSafeName + 'Custo.ts')),
          templateObj
        );

        // Helper
        this.fs.copyTpl(
          this.templatePath('src/custo/ProjectHelper.ts'),
          this.destinationPath(path.join('src', 'custo', templateObj.capitalizeCustomerSafeName + 'Helper.ts')),
          templateObj
        );

        // RegisteredNamedMethods
        this.fs.copyTpl(
          this.templatePath('src/custo/ProjectRegisteredNamedMethods.ts'),
          this.destinationPath(path.join('src', 'custo', templateObj.capitalizeCustomerSafeName + 'RegisteredNamedMethods.ts')),
          templateObj
        );

        // AgentBox.ts
        this.fs.copyTpl(
          this.templatePath('src/AgentBox.ts'),
          this.destinationPath('src/AgentBox.ts'),
          templateObj
        );

        // AgentFullSearch.ts
        this.fs.copyTpl(
          this.templatePath('src/AgentFullSearch.ts'),
          this.destinationPath('src/AgentFullSearch.ts'),
          templateObj
        );

        // CommunitySearch.ts
        this.fs.copyTpl(
          this.templatePath('src/CommunitySearch.ts'),
          this.destinationPath('src/CommunitySearch.ts'),
          templateObj
        );

        // ProjectCore.ts
        this.fs.copyTpl(
          this.templatePath('src/ProjectCore.ts'),
          this.destinationPath(path.join('src', '', templateObj.capitalizeCustomerSafeName + 'Core.ts')),
          templateObj
        );

        // SwapVar.ts
        this.fs.copyTpl(
          this.templatePath('src/SwapVar.ts'),
          this.destinationPath('src/SwapVar.ts'),
          templateObj
        );

        this.fs.copy(
          this.templatePath('src/events/CustomEvents.ts'),
          this.destinationPath('src/events/CustomEvents.ts')
        );

        this.fs.copy(
          this.templatePath('src/utils/**/*'),
          this.destinationPath('src/utils')
        );

        mkdirp.sync(this.destinationPath('src/ui'));

    }
}