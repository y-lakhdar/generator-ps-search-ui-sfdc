Coveo.TemplateCache.registerTemplate("SharePointList", Coveo.HtmlTemplate.fromString("<div class=\"coveo-result-frame\">\n  <div class=\"coveo-result-row\">\n    <div class=\"coveo-result-cell coveo-no-wrap\" style=\"vertical-align: middle\">\n      <span class=\"CoveoIcon\" data-small=\"true\"></span>\n      <a class=\"CoveoSalesforceResultLink\"></a>\n    </div>\n    <div class=\"coveo-result-cell\" style=\"text-align:right; padding-right:5px; width:126px;vertical-align: middle;font-size:12px;\">\n      <span class=\"CoveoAttachToCase\" data-display-text=\"false\"></span>\n      <span class=\"CoveoFieldValue\" data-field=\"@date\" data-helper=\"dateTime\"></span>\n    </div>\n    <div class=\"coveo-result-cell\" style=\"width:20px; vertical-align:middle; text-align:right\">\n      <div class=\"CoveoBoxResultAction\">\n        <div class=\"CoveoBoxQuickview\"></div>\n        <div class=\"CoveoBoxAttachToCase\"></div>\n      </div>\n    </div>\n  </div>\n  <div class=\"coveo-result-row\">\n    <div class=\"coveo-result-cell coveo-no-wrap\">\n      <span class=\"CoveoExcerpt\"></span>\n    </div>\n  </div>\n  <div class=\"coveo-result-row\">\n    <div class=\"coveo-result-cell coveo-no-wrap\">\n      <span class=\"CoveoPrintableUri\"></span>\n    </div>\n  </div>\n</div>\n", "(raw.connectortype == 'SharePoint' || raw.connectortype == 'SharepointCrawler') && raw.spitemtype == 'List'"), true, true)
Coveo.TemplateCache.registerTemplate("SharePoint", Coveo.HtmlTemplate.fromString("<div class=\"coveo-result-frame\">\n  <div class=\"coveo-result-row\">\n    <div class=\"coveo-result-cell coveo-no-wrap\" style=\"vertical-align: middle\">\n      <span class=\"CoveoIcon\" data-small=\"true\"></span>\n      <a class=\"CoveoSalesforceResultLink\"></a>\n    </div>\n    <div class=\"coveo-result-cell\" style=\"text-align:right; padding-right:5px; width:126px;vertical-align: middle;font-size:12px;\">\n      <span class=\"CoveoAttachToCase\" data-display-text=\"false\"></span>\n      <span class=\"CoveoFieldValue\" data-field=\"@date\" data-helper=\"dateTime\"></span>\n    </div>\n    <div class=\"coveo-result-cell\" style=\"width:20px; vertical-align:middle; text-align:right\">\n      <div class=\"CoveoBoxResultAction\">\n        <div class=\"CoveoBoxQuickview\"></div>\n        <div class=\"CoveoBoxAttachToCase\"></div>\n      </div>\n    </div>\n  </div>\n  <div class=\"coveo-result-row\">\n    <div class=\"coveo-result-cell coveo-no-wrap\">\n      <span class=\"CoveoExcerpt\"></span>\n    </div>\n  </div>\n  <div class=\"coveo-result-row coveo-no-wrap\">\n    <div class=\"coveo-result-cell\">\n      <span class=\"CoveoPrintableUri\">\n      </span>\n    </div>\n  </div>\n</div>", "(raw.connectortype == 'SharePoint' || raw.connectortype == 'SharepointCrawler') && raw.spitemtype != 'List'"), true, true)