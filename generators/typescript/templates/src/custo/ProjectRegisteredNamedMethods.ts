import { <%= capitalizeCustomerSafeName %>Custo } from './<%= capitalizeCustomerSafeName %>Custo';

export function init<%= capitalizeCustomerSafeName %>Custo(element: HTMLElement, options: any = {}, custoOptions: any = {}) {
  Coveo.Initialization.initializeFramework(element, options, () => {
    
    const custo = new <%= capitalizeCustomerSafeName %>Custo(element);
    custo.initStrings();
    const customOptions = _.extend(options, custo.getDefaultOptions());

    return Coveo.Initialization.initSearchInterface(element, customOptions);

  });
}

export function init<%= capitalizeCustomerSafeName %>AgentBoxCusto(element: HTMLElement, options: any = {}, custoOptions: any = {}) {
  Coveo.Initialization.initializeFramework(element, options, () => {

    const custo = new <%= capitalizeCustomerSafeName %>Custo(element);
    // custo.initStrings();
    const customOptions = _.extend(options, custo.getDefaultOptions());

    return Coveo.Initialization.initBoxInterface(element, customOptions);

  });
}

Coveo.Initialization.registerNamedMethod('init<%= capitalizeCustomerSafeName %>Custo', (element: HTMLElement, options: any = {}, custoOptions: any = {}) => {
  init<%= capitalizeCustomerSafeName %>Custo(element, options, custoOptions);
});

Coveo.Initialization.registerNamedMethod('init<%= capitalizeCustomerSafeName %>AgentBoxCusto', (element: HTMLElement, options: any = {}) => {
  init<%= capitalizeCustomerSafeName %>AgentBoxCusto(element, options);
});
