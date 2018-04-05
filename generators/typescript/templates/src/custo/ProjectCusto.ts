import {
  IQuerySuccessEventArgs,
  $$,
  IBuildingQueryEventArgs,
  IDoneBuildingQueryEventArgs,
  IPreprocessResultsEventArgs,
  InitializationEvents,
  INewQueryEventArgs,
  QueryEvents,
  Dom
} from 'coveo-search-ui';

export class <%= capitalizeCustomerSafeName %>Custo {

  private rootElement: Coveo.Dom;

  constructor(public searchInterfaceElement: HTMLElement) {

    this.rootElement = $$(searchInterfaceElement);

    // Initialization Events
    this.rootElement.on(InitializationEvents.beforeInitialization, () => this.handleBeforeInit());
    this.rootElement.on(InitializationEvents.afterInitialization, () => this.handleAfterInit());
    this.rootElement.on(InitializationEvents.afterComponentsInitialization, () => this.handleAfterComponentsInit());

    // Query Events
    this.rootElement.on(QueryEvents.newQuery, (e: Event, data: INewQueryEventArgs) => this.handleNewQuery(e, data));
    this.rootElement.on(QueryEvents.buildingQuery, (e: Event, data: IBuildingQueryEventArgs) => this.handleBuildingQuery(e, data));
    this.rootElement.on(QueryEvents.doneBuildingQuery, (e: Event, data: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(e, data));
    this.rootElement.on(QueryEvents.preprocessResults, (e: Event, data: IPreprocessResultsEventArgs) => this.handlePreprocessResults(e, data));
    this.rootElement.on(QueryEvents.querySuccess, (e: Event, data: IQuerySuccessEventArgs) => this.handleQuerySuccess(e, data));
  }

  /**
   * Before Initialization
   */
  private handleBeforeInit() { }
  /**
   * After Initialization
   * initializing custom strings during before init event to avoid any issue with SFDC init strings.
   */
  private handleAfterInit() {
    this.initStrings();
  }
  /**
   * After Component Initialization
   */
  private handleAfterComponentsInit() { }
  /**
   * New Query
   */
  private handleNewQuery(evt: Event, args: INewQueryEventArgs) { }
  /**
   * Building Query
   */
  private handleBuildingQuery(evt: Event, args: IBuildingQueryEventArgs) { }
  /**
   * Done Building Query
   */
  private handleDoneBuildingQuery(evt: Event, args: IDoneBuildingQueryEventArgs) { }
  /**
   * Preprocess Results
   */
  private handlePreprocessResults(evt: Event, args: IPreprocessResultsEventArgs) { }
  /**
   * Query Success
   */
  private handleQuerySuccess(evt: Event, args: Coveo.IQuerySuccessEventArgs) { }

  /**
   * Initialized Custom Strings
   */
  public initStrings() {
    // Custom variable for current application
    window.String.toLocaleString({
      'en': {
        'ShowingResultsOf': 'Result<pl>s</pl> {0}<pl>-{1}</pl> of about {2}',
        'RemoveContext': 'Remove Case Filters',
        'GoToFullSearch': 'Full Search Page'
      }
    });
  }

  /**
   * Set default options of different UI Components for <%= capitalizeCustomerSafeName %>.
   */
  public getDefaultOptions(): any {
    return {
      SalesforceResultLink: {
        alwaysOpenInNewWindow: true
      },
      ResultLink: {
        alwaysOpenInNewWindow: true
      },
      Facet: {
        availableSorts: ['occurrences', 'score', 'alphaAscending', 'alphaDescending'],
        valueCaption: {
          'Not Specified': 'Unspecified',
          'Web Misc.': 'Web (other)'
        }
      }
    };
  }
}
