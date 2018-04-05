const SOURCE_ICONS_MAPPING: any = {
  'unknown': 'CoveoIcon'
};

export class I<%= capitalizeCustomerSafeName %>IconOptions {
  value: string = '';
  additionalClass: string = '';
}

export interface I<%= capitalizeCustomerSafeName %>KBExternalLinkOptions {
  baseUrl: string;
}

export class <%= capitalizeCustomerSafeName %>Helper {

  static kbExternalLinkOptions: I<%= capitalizeCustomerSafeName %>KBExternalLinkOptions = {
    baseUrl: 'http://kb.<%= capitalizeCustomerSafeName %>.com/articles/'
  };

  static from<%= capitalizeCustomerSafeName %>TypeToIcon(result: Coveo.IQueryResult, options: I<%= capitalizeCustomerSafeName %>IconOptions): string {
    let iconCss = options.value;
    let hoverLabel = result.raw.commonsource || '';
    if (Coveo.Utils.isNullOrEmptyString(iconCss)) {
      const commonSrc = (result.raw.commonsource || '').toLowerCase();
      iconCss = SOURCE_ICONS_MAPPING[commonSrc.toLowerCase()] || SOURCE_ICONS_MAPPING['unknown'];

      if (commonSrc === 'knowledge base') {  // extra logic for KB
        iconCss = <%= capitalizeCustomerSafeName %>Helper.isAPublicKB(result) ? 'icon-external-knowledge-base' : 'icon-internal-knowledge-base';
        hoverLabel = <%= capitalizeCustomerSafeName %>Helper.isAPublicKB(result) ? 'External Knowledge Base' : 'Internal Knowledge Base';
      } else if (commonSrc === 'community') { // extra logic for Community
        const question = result.raw.jivequestion ? result.raw.jivequestion.toLowerCase() : '';

        iconCss = (question === 'true' && result.raw.jiveanswer != null) ? 'icon-community-discussion-answered' : iconCss;
        iconCss = (question === 'true' && (!result.raw.jiveanswer || result.raw.jiveanswer === 'False')) ? 'icon-community-discussion-unanswered' : iconCss;
      }

      iconCss = !Coveo.Utils.isNullOrEmptyString(options.additionalClass) ? (iconCss + ' ' + options.additionalClass) : iconCss;
    }

    return Coveo.$$('i', {
      className: iconCss,
      title: hoverLabel,
      'aria-hidden': true
    }).el.outerHTML;
  }

  static customDate(d: Date): string {
    const dateOnly = Coveo.DateUtils.keepOnlyDatePart(d);
    const today = Coveo.DateUtils.keepOnlyDatePart(new Date());
    const options: Coveo.IDateToStringOptions = {};

    if (dateOnly.getFullYear() === today.getFullYear()) {
      options.predefinedFormat = 'MMM dd';
    } else {
      options.predefinedFormat = 'MMM dd, yyyy';
    }
    return Coveo.DateUtils.dateToString(d, options);
  }

  static KBExternalLink(result: Coveo.IQueryResult, options: I<%= capitalizeCustomerSafeName %>KBExternalLinkOptions): string {
    let kbExternalUrl = '';
    let kbArticleType = result.raw.sfkbarticletype || result.raw.sfknowledgebasearticletype || '';
    let lang = result.raw.sflanguage || '';
    if (kbArticleType) {
      kbArticleType = kbArticleType.replace(/__kav/i, '');
      const kbUrlName = result.raw.sfkburlname || result.raw.sfknowledgebaseurlname || '';
      let urlPath = kbArticleType + '/' + kbUrlName;
      lang = lang.substring(0, 2) || lang;
      urlPath = result.raw.commonlanguage.toLowerCase() == 'english' ? urlPath : (urlPath + '?lang=' + lang);
      kbExternalUrl = kbUrlName ? (options.baseUrl + urlPath) : result.raw.clickUri;
    }
    return kbExternalUrl;

  }

  static isAPublicKB(result: Coveo.IQueryResult): boolean {
    let retVal = false;

    if (result.raw.sfkbid && result.raw.sfkbisvisibleinpkb === 'True') { retVal = true; }
    if (result.raw.sfkbid && result.raw.sfknowledgebaseisvisibleinpkb === 'True') { retVal = true; }

    return retVal;
  }
}
