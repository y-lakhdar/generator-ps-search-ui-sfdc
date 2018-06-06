var Coveo, Coveo_tmp_SF = Coveo || {};Coveo =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 99);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = window.Coveo;

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

module.exports = $;

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

module.exports = _;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var SalesforceUtilities = /** @class */ (function () {
    function SalesforceUtilities() {
    }
    SalesforceUtilities.isInSalesforce = function () {
        return window.sforce != undefined;
    };
    SalesforceUtilities.isInLightning = function () {
        // Check if the aura framework is loaded.
        return window['$A'] !== undefined;
    };
    SalesforceUtilities.isInSalesforceConsole = function () {
        return SalesforceUtilities.isInSalesforce() && window.sforce.console != undefined && window.sforce.console.isInConsole();
    };
    SalesforceUtilities.focusOrOpenTab = function (url, tabText, openInPrimaryTab) {
        if (openInPrimaryTab === void 0) { openInPrimaryTab = false; }
        url = typeof url !== 'undefined' ? url : '';
        var originalUrl = url;
        url = url.split('#')[0].split('?')[0];
        var urlId = this.getSfIdFromUrl(url);
        var endsWith = function (str, suffix) {
            if (!(str && suffix))
                return false;
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };
        var resultError = function (result) {
            if (!result.success) {
                openSubtab(focusedPrimaryTabId, url);
                return true;
            }
            return false;
        };
        // For helper message
        var outputConsoleDomainErrorMessage = function () {
            console.log("Unexpected Behaviour? Please check your Domain is set in your Salesforce App's 'Whitelist Domains' section.");
            console.log('Settings are located in Build > Apps > ‘App Name’ (edit) > Whitelist Domains');
        };
        // Open in subtab
        var subtabCount = 0;
        var tabFocused = false;
        var subtabIndex = 0;
        var focusedPrimaryTabId = null;
        var openSubtab = function (primaryTabId, url) {
            window.sforce.console.openSubtab(primaryTabId, originalUrl, true, tabText, null, function openSuccess(result) {
                // `result.success` comes from the window.sforce.console object and will be set to FALSE when `openSubtab` fails
                if (!result.success) {
                    window.open(originalUrl);
                    outputConsoleDomainErrorMessage();
                }
            });
        };
        var handleGetSubtabInfo = function (result, id) {
            if (!resultError(result)) {
                subtabIndex++;
                if (!tabFocused) {
                    var tabUrl = $.parseJSON(result.pageInfo).url;
                    tabUrl = tabUrl ? tabUrl.split('#')[0].split('?')[0] : tabUrl;
                    var tabUrlId = $.parseJSON(result.pageInfo).objectId;
                    tabUrlId = tabUrlId ? tabUrlId.substr(0, 15) : tabUrl;
                    if (tabUrlId == urlId || (endsWith(url, tabUrl) || endsWith(tabUrl, url))) {
                        window.sforce.console.focusSubtabById(id);
                        tabFocused = true;
                    }
                    subtabCount--;
                    if (!tabFocused && subtabCount == 0) {
                        openSubtab(focusedPrimaryTabId, url);
                    }
                }
            }
        };
        var handleGetSubTabIds = function (result) {
            if (!resultError(result)) {
                subtabCount = result.ids.length;
                for (var i = 0; i < result.ids.length; i++) {
                    window.sforce.console.getPageInfo(result.ids[i], function (newResult) {
                        handleGetSubtabInfo(newResult, result.ids[subtabIndex]);
                    });
                }
            }
        };
        var handleGetFocusedPrimaryTabId = function (result) {
            if (!resultError(result)) {
                focusedPrimaryTabId = result.id;
                window.sforce.console.getSubtabIds(result.id, handleGetSubTabIds);
            }
        };
        if (!openInPrimaryTab) {
            window.sforce.console.getFocusedPrimaryTabId(handleGetFocusedPrimaryTabId);
        }
        // Open in primary tab
        var primaryTabCount = 0;
        var primaryTabIndex = 0;
        var openPrimaryTab = function (url) {
            window.sforce.console.openPrimaryTab(null, originalUrl, true, tabText, function openSuccess(result) {
                // `result.success` comes from the window.sforce.console object and will be set to FALSE when `openPrimaryTab` fails
                if (!result.success) {
                    window.open(originalUrl);
                    outputConsoleDomainErrorMessage();
                }
            });
        };
        var handleGetPrimaryTabInfo = function (result, id) {
            if (!resultError(result)) {
                primaryTabIndex++;
                if (!tabFocused) {
                    var tabUrl = $.parseJSON(result.pageInfo).url;
                    tabUrl = tabUrl ? tabUrl.split('#')[0].split('?')[0] : tabUrl;
                    var tabUrlId = $.parseJSON(result.pageInfo).objectId;
                    tabUrlId = tabUrlId ? tabUrlId.substr(0, 15) : tabUrl;
                    if (tabUrlId == urlId || (endsWith(url, tabUrl) || endsWith(tabUrl, url))) {
                        window.sforce.console.focusPrimaryTabById(id);
                        tabFocused = true;
                    }
                    primaryTabCount--;
                    if (!tabFocused && primaryTabCount == 0) {
                        openPrimaryTab(url);
                    }
                }
            }
        };
        var handleGetPrimaryTabIds = function (result) {
            if (!resultError(result)) {
                primaryTabCount = result.ids.length;
                for (var i = 0; i < result.ids.length; i++) {
                    window.sforce.console.getPageInfo(result.ids[i], function (newResult) {
                        handleGetPrimaryTabInfo(newResult, result.ids[primaryTabIndex]);
                    });
                }
            }
        };
        if (openInPrimaryTab) {
            window.sforce.console.getPrimaryTabIds(handleGetPrimaryTabIds);
        }
    };
    SalesforceUtilities.getSfIdFromUrl = function (url) {
        var id = url.substr(url.lastIndexOf('/') + 1, 18);
        var idIsValid = /^\w+$/.test(id);
        if (!idIsValid) {
            return url.split('#')[0].split('?')[0];
        }
        return id.substr(0, 15);
    };
    SalesforceUtilities.expandStringUsingRecord = function (value, record) {
        if (value != null) {
            var matches = value.match(/\{!(>?)(.*?)\}/g);
            if (matches != null) {
                for (var i = 0; i < matches.length; i++) {
                    var match = matches[i];
                    var groups = /\{!(>?)(.*?)\}/g.exec(match);
                    var cleanup = groups[1] === '>';
                    var fieldName = groups[2].toLowerCase();
                    var fieldValue = '';
                    if (record[fieldName] != null) {
                        fieldValue = record[fieldName].toString();
                        if (cleanup) {
                            fieldValue = SalesforceUtilities.cleanSentenceForQuery(fieldValue);
                        }
                    }
                    value = value.replace(groups[0], fieldValue);
                }
            }
        }
        return value;
    };
    SalesforceUtilities.expandStringUsingExpert = function (value, expert) {
        if (value != null) {
            var matches = value.match(/%(\w+)%/g);
            if (matches != null) {
                for (var i = 0; i < matches.length; i++) {
                    var match = matches[i];
                    var groups = /%(\w+)%/g.exec(match);
                    var fieldName = groups[1].toLowerCase();
                    var fieldValue = coveo_search_ui_1.Utils.getFieldValue(expert, fieldName);
                    if (fieldValue != null) {
                        fieldValue = SalesforceUtilities.cleanSentenceForQuery(fieldValue);
                    }
                    else {
                        fieldValue = '';
                    }
                    value = value.replace(groups[0], fieldValue);
                }
            }
        }
        return value;
    };
    SalesforceUtilities.cleanSentenceForQuery = function (sentence) {
        return sentence.replace(/[\[\]"'\(\),\.@=<>:]/g, '');
    };
    return SalesforceUtilities;
}());
exports.SalesforceUtilities = SalesforceUtilities;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var SalesforceUtils_1 = __webpack_require__(7);
// This class is, as it's name implied, used only in the salesforce integration to handle
// results link that can be opened in the console correctly.
// When the page is created in salesforce (interface editor) all CoveoResultLink are replaced with CoveoSalesforceResultLink.
/**
 * The _SalesforceResultLink_ component is used to open result links as Salesforce tabs.
 *
 * It inherits from the [ResultLink Component](https://coveo.github.io/search-ui/components/resultlink.html).
 *
 * ```html
 * <a class='CoveoSalesforceResultLink'></a>
 * ```
 */
var SalesforceResultLink = /** @class */ (function (_super) {
    __extends(SalesforceResultLink, _super);
    function SalesforceResultLink(element, options, bindings, result) {
        var _this = _super.call(this, element, coveo_search_ui_1.ComponentOptions.initComponentOptions(element, SalesforceResultLink, options), bindings, result) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        return _this;
    }
    SalesforceResultLink.prototype.bindEventToOpen = function () {
        var _this = this;
        if (SalesforceUtils_1.SalesforceUtilities.isInSalesforceConsole()) {
            var eventWasBinded = false;
            // Note: For Salesforce Tabs to work, check that your Domains are whitelisted in your App's "Whitelist Domains" section.
            if (this.options.openInPrimaryTab) {
                $(this.element).click(function () {
                    SalesforceUtils_1.SalesforceUtilities.focusOrOpenTab(decodeURIComponent(_this.result.clickUri), _this.result.title, true);
                });
                eventWasBinded = true;
            }
            else if (this.options.openInSubTab) {
                $(this.element).click(function () {
                    SalesforceUtils_1.SalesforceUtilities.focusOrOpenTab(decodeURIComponent(_this.result.clickUri), _this.result.title, false);
                });
                eventWasBinded = true;
            }
            if (!eventWasBinded) {
                eventWasBinded = _super.prototype.bindEventToOpen.call(this);
            }
            return eventWasBinded;
            // Bind lightning aura actions instead of redirecting to another URL.
            // If we want to open in a new window, it will use the ResultLink logic to open it.
        }
        else if (SalesforceUtils_1.SalesforceUtilities.isInLightning() && this.areOptionsSupportedInLightning()) {
            this.bindEventToOpenInLightning();
        }
        else {
            // Fallback on the result link logic.
            return _super.prototype.bindEventToOpen.call(this);
        }
    };
    SalesforceResultLink.prototype.areOptionsSupportedInLightning = function () {
        // Those options are not supported in lightning. Fallback on the ResultLink.
        return !this.options.alwaysOpenInNewWindow && !this.options.openInOutlook && !this.options.openQuickview;
    };
    SalesforceResultLink.prototype.bindEventToOpenInLightning = function () {
        var _this = this;
        $(this.element).on('click', function () {
            // Create the lightning event.
            var auraClickEvent = _this.createLightningClickEvent();
            coveo_search_ui_1.Assert.isNotNull(auraClickEvent);
            // Fire the aura event.
            auraClickEvent.fire();
        });
    };
    SalesforceResultLink.prototype.createLightningClickEvent = function () {
        var auraClickEvent;
        // If the result is a Salesforce object, we'll use the navigateToSObject action.
        if (this.result.raw.sfid !== undefined) {
            // is any other Salesforce objects.
            auraClickEvent = $A.get('e.force:navigateToSObject');
            auraClickEvent.setParams({
                recordId: this.getIdForNavigateToSObject()
            });
        }
        else {
            // is non salesforce items.
            auraClickEvent = $A.get('e.force:navigateToURL');
            auraClickEvent.setParams({
                url: this.result.clickUri
            });
        }
        return auraClickEvent;
    };
    SalesforceResultLink.prototype.getIdForNavigateToSObject = function () {
        var idToUse = this.result.raw.sfid;
        // Knowledge article uses the knowledge article version id to navigate.
        if (this.result.raw.sfkbid !== undefined && this.result.raw.sfkavid !== undefined) {
            idToUse = this.result.raw.sfkavid;
        }
        return idToUse;
    };
    SalesforceResultLink.ID = 'SalesforceResultLink';
    /**
     * The possible options for SalesforceResultLink
     * @componentOptions
     */
    SalesforceResultLink.options = {
        /**
         * Specifies that the result link should try to open as a primary console tab. If it fails, it instead opens in a new browser tab.
         *
         * Default is `true`.
         *
         * ```html
         * <a class='CoveoSalesforceResultLink' data-open-in-primary-tab='true'/>
         * ```
         */
        openInPrimaryTab: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies that the result link should try to open as a secondary console tab. If it fails, it instead opens in a new browser tab.
         *
         * Default is `false`.
         *
         * ```html
         * <a class='CoveoSalesforceResultLink' data-open-in-sub-tab='true'/>
         * ```
         */
        openInSubTab: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return SalesforceResultLink;
}(coveo_search_ui_1.ResultLink));
exports.SalesforceResultLink = SalesforceResultLink;
// The options are extended here to ensure TypeDoc builds the documentation properly.
SalesforceResultLink.options = _.extend({}, coveo_search_ui_1.ResultLink.options, SalesforceResultLink.options);
coveo_search_ui_1.Initialization.registerAutoCreateComponent(SalesforceResultLink);
coveo_search_ui_1.Initialization.registerComponentFields(SalesforceResultLink.ID, coveo_search_ui_1.Initialization.getRegisteredFieldsComponentForQuery(coveo_search_ui_1.ResultLink.ID).concat(['sfid', 'sfkbid', 'sfkavid']));


/***/ }),
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UserActionEvents = /** @class */ (function () {
    function UserActionEvents() {
    }
    UserActionEvents.enterOnSearchbox = 'enterOnSearchbox';
    UserActionEvents.quickviewLoaded = 'quickviewLoaded';
    UserActionEvents.openQuickview = 'openQuickview';
    UserActionEvents.attachToCase = 'attachToCase';
    UserActionEvents.detachFromCase = 'detachFromCase';
    UserActionEvents.attachedResultChange = 'attachedResultChange';
    UserActionEvents.attachToCaseStateChanged = 'attachToCaseStateChanged';
    return UserActionEvents;
}());
exports.UserActionEvents = UserActionEvents;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(6);
var ArgWithQuote;
(function (ArgWithQuote) {
    /* Keep the withQuote behaviour from the ExtensionBuilder. */
    ArgWithQuote[ArgWithQuote["DEFAULT"] = 0] = "DEFAULT";
    /* Overrides the behaviour of the ExtensionBuilder to add quotes. */
    ArgWithQuote[ArgWithQuote["WITH_QUOTES"] = 1] = "WITH_QUOTES";
    /* Overrides the behaviour of the ExtensionBuilder to not add quotes. */
    ArgWithQuote[ArgWithQuote["WITHOUT_QUOTES"] = 2] = "WITHOUT_QUOTES";
})(ArgWithQuote = exports.ArgWithQuote || (exports.ArgWithQuote = {}));
var ExtensionBuilder = /** @class */ (function () {
    function ExtensionBuilder(name, withQuote) {
        if (withQuote === void 0) { withQuote = true; }
        this.name = name;
        this.withQuote = withQuote;
        this.params = [];
    }
    /*
     * Add a new parameter to the extension.
     * @param key Name of the argument.
     * @param value Value of the argument.
     * @param argWithQuote If given, overrides the behaviour of the extension builder.
     */
    ExtensionBuilder.prototype.withParam = function (key, value, argWithQuote) {
        if (argWithQuote === void 0) { argWithQuote = ArgWithQuote.DEFAULT; }
        this.params.push({
            key: key,
            value: value,
            argWithQuote: argWithQuote
        });
        return this;
    };
    /*
     * Builds the extension string by combining all the parts together.
     */
    ExtensionBuilder.prototype.build = function () {
        var _this = this;
        var defaultQuote = this.withQuote ? "'" : '';
        return ('$' +
            this.name +
            '(' +
            _.map(this.params, function (param) {
                if (param.value.replace != undefined) {
                    param.value = param.value.replace(/\'/g, '');
                }
                return param.key + ': ' + _this.argumentToString(param, defaultQuote);
            }).join(', ') +
            ')');
    };
    ExtensionBuilder.prototype.argumentToString = function (arg, defaultQuote) {
        var quote = defaultQuote;
        if (arg.argWithQuote != ArgWithQuote.DEFAULT) {
            // Overrides the behaviour of the ExtensionBuilder for this argument.
            quote = arg.argWithQuote == ArgWithQuote.WITH_QUOTES ? "'" : '';
        }
        return quote + arg.value + quote;
    };
    return ExtensionBuilder;
}());
exports.ExtensionBuilder = ExtensionBuilder;


/***/ }),
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getSalesforceContext() {
    return window['SalesforceContext'];
}
exports.getSalesforceContext = getSalesforceContext;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var BoxStateModel = /** @class */ (function (_super) {
    __extends(BoxStateModel, _super);
    function BoxStateModel(element, attributes, bindings) {
        var _this = this;
        var merged = _.extend({}, BoxStateModel.defaultAttributes, attributes);
        _this = _super.call(this, element, BoxStateModel.ID, merged) || this;
        return _this;
    }
    BoxStateModel.prototype.getSimpleEvent = function (name) {
        return this.getEventName(coveo_search_ui_1.Model.eventTypes.changeOne + name);
    };
    /**
     * Validates whether at least one facet is currently active (has selected or excluded values) in the interface.
     *
     * @returns {boolean} `true` if at least one facet is active; `false` otherwise.
     */
    BoxStateModel.prototype.atLeastOneFacetIsActive = function () {
        var _this = this;
        return !_.isUndefined(_.find(this.attributes, function (value, key) {
            return key.indexOf('f:') == 0 && !coveo_search_ui_1.Utils.arrayEqual(_this.getDefault(key), value);
        }));
    };
    BoxStateModel.ID = 'boxstate';
    BoxStateModel.defaultAttributes = {
        enableNonContextualSearch: false,
        t: ''
    };
    BoxStateModel.attributesEnum = {
        enableNonContextualSearch: 'enableNonContextualSearch',
        t: 't'
    };
    return BoxStateModel;
}(coveo_search_ui_1.Model));
exports.BoxStateModel = BoxStateModel;
coveo_search_ui_1.Initialization.registerNamedMethod('boxstate', function (element) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    coveo_search_ui_1.Assert.exists(element);
    var model = coveo_search_ui_1.Component.resolveBinding(element, BoxStateModel);
    return coveo_search_ui_1.setState(model, args);
});


/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var UserActionEvents_1 = __webpack_require__(11);
/**
 * The _AttachToCase_ component is a Result Templates component that allows you to link a result to a Salesforce case.
 *
 * **Note:**
 * > When wanting to attach Knowledge articles, ensure that the `sfkbid`, `sfkbversionnumber`, and `sflanguage` fields are properly populated on the article
 * (see [Add/Edit Mapping](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=285) for Cloud V2 and [Managing Fields for a Source](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=190) for Cloud V1).
 *
 * ```html
 * <div class="CoveoAttachToCase"></div>
 * ```
 */
var AttachToCase = /** @class */ (function (_super) {
    __extends(AttachToCase, _super);
    function AttachToCase(element, options, bindings, result) {
        var _this = _super.call(this, element, AttachToCase.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, AttachToCase, options);
        _this.result = _this.result || _this.resolveResult();
        _this.searchInterface = _this.searchInterface || _this.resolveSearchInterface();
        _this.attached = false;
        _this.loading = false;
        _this.initialized = false;
        var attachToCaseEndpoint = _this.options.attachToCaseEndpoint();
        if (attachToCaseEndpoint != null) {
            _this.setAttachToCaseEndpoint(attachToCaseEndpoint);
        }
        else {
            _this.logger.warn('No endpoint detected, make sure to set one using the SetAttachToCaseEndpoint method.');
        }
        return _this;
    }
    AttachToCase.prototype.initialize = function () {
        var _this = this;
        if (this.attachToCaseEndpoint != null) {
            // AttachToCaseEndpoint.data can either be a promise or just the data.
            var attachToCaseEndpointPromise = this.attachToCaseEndpoint.data;
            if (attachToCaseEndpointPromise.then) {
                // If the data is a promise, set state to loading, render button and wait for Promise competion.
                this.loading = true;
                attachToCaseEndpointPromise
                    .then(function (data) {
                    _this.attachToCaseEndpoint.data = data;
                    _this.handleData(_this.attachToCaseEndpoint.data);
                    _this.initialized = true;
                    _this.loading = false;
                    _this.updateButton();
                })
                    .catch(function (error) {
                    _this.logger.error('An error occured while getting attached results', error.message);
                });
            }
            else {
                this.attachToCaseEndpoint.data = this.attachToCaseEndpoint.data;
                if (this.attachToCaseEndpoint.data.succeeded) {
                    this.handleData(this.attachToCaseEndpoint.data);
                    this.initialized = true;
                }
                else {
                    this.logger.error('An error occured while getting attached results', this.attachToCaseEndpoint.data.message);
                }
            }
            this.bind.on(window, UserActionEvents_1.UserActionEvents.attachedResultChange, function (args) {
                return _this.handleAttachedResultChangeEvent(args);
            });
            $(this.root).on(UserActionEvents_1.UserActionEvents.attachToCaseStateChanged, function (e, arg) { return _this.handleStateChanged(arg); });
            this.renderButton();
        }
        else {
            this.logger.warn('No endpoint detected, make sure to set one using the SetAttachToCaseEndpoint method.');
        }
    };
    /**
     * Attaches the result to the current Case.
     *
     * ```js
     * $('#myAttachToCase').coveo('attach')
     * ```
     */
    AttachToCase.prototype.attach = function () {
        var _this = this;
        if (this.isAttached() && this.initialized && !this.loading) {
            return;
        }
        this.loading = true;
        this.updateButton();
        // Check for empty *attachedResultRecord* fields ( Note: caseId comes from !{caseId} in AttachToCase.component )
        var requiredFields = ['uriHash', 'resultUrl', 'source', 'title', 'name'];
        var requiredFieldsMissing = [];
        // Temporary variable so we don’t modify *this.result.raw.sfkbversionnumber*
        var actualSfkbVersionNumber = this.result.raw.sfkbversionnumber;
        // If we have an article ... also check articleLanguage and articleVersionNumber
        if (this.result.raw.sfkbid && actualSfkbVersionNumber) {
            requiredFields.push('articleLanguage');
            // Make sure *sfkbversionnumber* is a Number
            actualSfkbVersionNumber = Number(actualSfkbVersionNumber);
            if (_.isNaN(actualSfkbVersionNumber)) {
                var errorMessage = 'The field sfkbversionnumber is not a valid Number.';
                this.logger.error(errorMessage);
                this.displayModalBoxHelper(errorMessage);
                return;
            }
        }
        var resultToAttach = {
            resultUrl: coveo_search_ui_1.StringAndHoles.shortenString(this.result.clickUri, 250, '...').value,
            source: this.result.raw.source,
            title: coveo_search_ui_1.StringAndHoles.shortenString(this.result.title, 250, '...').value,
            name: coveo_search_ui_1.StringAndHoles.shortenString(this.result.title, 80, '...').value,
            uriHash: this.result.raw.urihash,
            knowledgeArticleId: this.result.raw.sfkbid,
            articleLanguage: this.result.raw.sflanguage,
            articleVersionNumber: actualSfkbVersionNumber,
            articlePublishStatus: this.result.raw.sfpublishstatus,
            caseId: this.attachToCaseEndpoint.caseId,
            customs: {}
        };
        // Check fields for empty values
        requiredFields.forEach(function (field) {
            if (_.isEmpty(resultToAttach[field])) {
                requiredFieldsMissing.push(field);
            }
        });
        // If we have missing fields, show error + abort attach()
        if (requiredFieldsMissing.length > 0) {
            var errorMessage = "You're missing the " + requiredFieldsMissing.join(', ') + ' field(s).';
            this.logger.error(errorMessage);
            this.displayModalBoxHelper(errorMessage);
            return;
        }
        var args = {
            result: this.result,
            dataToAttach: resultToAttach
        };
        $(window).trigger(UserActionEvents_1.UserActionEvents.attachToCase, args);
        this.logger.info('Attaching result to case', args);
        this.attachToCaseEndpoint.attachToCase(args.dataToAttach, function (arg) { return _this.handleAttachCallback(arg); });
    };
    /**
     * Detaches the result from the current Case.
     *
     * ```js
     * $('#myAttachToCase').coveo('detach')
     * ```
     */
    AttachToCase.prototype.detach = function () {
        var _this = this;
        if (!this.isAttached() && this.initialized && !this.loading) {
            return false;
        }
        this.loading = true;
        this.updateButton();
        var args = {
            result: this.result,
            caseId: this.attachToCaseEndpoint.caseId
        };
        $(window).trigger(UserActionEvents_1.UserActionEvents.detachFromCase, args);
        this.logger.info('Detaching result from case', args);
        this.attachToCaseEndpoint.detachFromCase(this.result.raw.urihash, this.result.raw.sfkbid, this.attachToCaseEndpoint.caseId, function (arg) { return _this.handleDetachCallback(arg); });
    };
    AttachToCase.prototype.setAttachToCaseEndpoint = function (endpoint) {
        if (endpoint != null) {
            this.attachToCaseEndpoint = endpoint;
            this.initialize();
        }
    };
    /**
     * Returns whether or not the result is attached.
     *
     * ```js
     * $('#myAttachToCase').coveo('isAttached')
     * ```
     */
    AttachToCase.prototype.isAttached = function () {
        return this.attached;
    };
    AttachToCase.prototype.handleClick = function () {
        if (!this.loading) {
            this.isAttached() ? this.detach() : this.attach();
        }
    };
    AttachToCase.prototype.handleData = function (arg) {
        this.attachedResults = arg.attachedResults;
        this.attached =
            _.contains(arg.attachedResults, this.result.raw.urihash) ||
                (coveo_search_ui_1.Utils.isNullOrEmptyString(this.result.raw.sfkbid) ? false : _.contains(arg.attachedResults, this.result.raw.sfkbid));
    };
    AttachToCase.prototype.handleAttachCallback = function (arg) {
        if (arg != null) {
            if (arg.succeeded) {
                this.attached = true;
                if (arg.message) {
                    this.logger.warn(arg.message);
                }
                this.attachedResults.push(this.result.raw.urihash);
                if (!coveo_search_ui_1.Utils.isNullOrEmptyString(this.result.raw.sfkbid)) {
                    this.attachedResults.push(this.result.raw.sfkbid);
                }
                $(window).trigger('attachedResultChange', {
                    attachedResults: this.attachedResults.slice(0),
                    caseId: this.attachToCaseEndpoint.caseId
                });
                var customData = {
                    articleID: this.result.raw.sfkbid,
                    caseID: this.attachToCaseEndpoint.caseId,
                    resultUriHash: this.result.raw.urihash,
                    author: this.result.raw.author
                };
                this.usageAnalytics.logClickEvent(coveo_search_ui_1.analyticsActionCauseList.caseAttach, {
                    documentTitle: this.result.title,
                    documentURL: this.result.clickUri,
                    author: this.result.raw.author
                }, this.result, this.root);
                this.usageAnalytics.logCustomEvent(coveo_search_ui_1.analyticsActionCauseList.caseAttach, customData, this.root);
            }
            else {
                // Display errors ...
                this.logger.error('Attach failed', arg.message);
                this.displayModalBoxHelper(arg.message);
            }
        }
        this.loading = false;
        this.updateButton();
    };
    AttachToCase.prototype.handleDetachCallback = function (arg) {
        if (arg != null) {
            if (arg.succeeded) {
                this.attached = false;
                if (arg.message) {
                    this.logger.warn(arg.message);
                }
                this.logger.debug('Array before delete', this.attachedResults.concat());
                this.deleteFromResults(this.result.raw.urihash);
                if (!coveo_search_ui_1.Utils.isNullOrEmptyString(this.result.raw.sfkbid)) {
                    this.deleteFromResults(this.result.raw.sfkbid);
                }
                this.logger.debug('Array after delete', this.attachedResults);
                $(window).trigger('attachedResultChange', {
                    attachedResults: this.attachedResults.slice(0),
                    caseId: this.attachToCaseEndpoint.caseId
                });
                var customData = {
                    articleID: this.result.raw.sfkbid,
                    caseID: this.attachToCaseEndpoint.caseId,
                    resultUriHash: this.result.raw.urihash,
                    author: this.result.raw.author
                };
                this.usageAnalytics.logCustomEvent(coveo_search_ui_1.analyticsActionCauseList.caseDetach, customData, this.root);
            }
            else {
                this.logger.error('Detach failed', arg.message);
            }
        }
        this.loading = false;
        this.updateButton();
    };
    AttachToCase.prototype.deleteFromResults = function (obj) {
        // `delete` statement sets the element to `null|undefined`
        // If you perform a delete on an element of an array, the length of the array doesn't change. The element index is preserved and the value is set to 'undefined';
        // ie. [a, b, c] delete `b` yields [a, undefined, c]
        this.attachedResults.splice(this.attachedResults.indexOf(obj), 1);
    };
    AttachToCase.prototype.computeIsAttached = function () {
        return (_.contains(this.attachedResults, this.result.raw.urihash) ||
            (coveo_search_ui_1.Utils.isNullOrEmptyString(this.result.raw.sfkbid) ? false : _.contains(this.attachedResults, this.result.raw.sfkbid)));
    };
    AttachToCase.prototype.handleStateChanged = function (arg) {
        if (arg.target != this.element && arg.urihash == this.result.raw.urihash) {
            this.attached = this.computeIsAttached();
            this.loading = arg.loading;
            this.updateButton(false);
        }
    };
    AttachToCase.prototype.handleAttachedResultChangeEvent = function (args) {
        if (this.attachToCaseEndpoint.caseId == args.caseId) {
            var data = this.attachToCaseEndpoint.data;
            this.attachedResults = args.attachedResults;
            data.attachedResults = this.attachedResults;
            this.attached = this.computeIsAttached();
            this.updateButton(false);
        }
    };
    AttachToCase.prototype.displayModalBoxHelper = function (message) {
        Coveo.ModalBox.open($('<p>')
            .text(message)
            .get(0), {
            title: 'An error occured',
            overlayClose: true,
            buttons: Coveo.ModalBox.BUTTON.OK
        });
    };
    AttachToCase.prototype.renderButton = function () {
        var _this = this;
        $(this.element).empty();
        this.buttonElement = $(document.createElement('span')).appendTo(this.element);
        if (this.options.displayText) {
            this.textElement = $(document.createElement('span')).appendTo(this.buttonElement);
            this.textElement.addClass('coveo-attach-to-case-text');
        }
        if (!this.options.readonly) {
            $(this.element).click(function () { return _this.handleClick(); });
            $(this.element).hover(function () { return _this.handleHover(true); }, function () { return _this.handleHover(false); });
        }
        this.updateButton();
    };
    AttachToCase.prototype.handleHover = function (isIn) {
        if (this.isAttached() && this.options.displayText) {
            this.textElement.text(isIn ? coveo_search_ui_1.l('Detach') : coveo_search_ui_1.l('Attached'));
        }
    };
    AttachToCase.prototype.sendStateChangedEvent = function () {
        var arg = {
            target: this.element,
            urihash: this.result.raw.urihash,
            loading: this.loading
        };
        $(this.root).trigger(UserActionEvents_1.UserActionEvents.attachToCaseStateChanged, arg);
    };
    AttachToCase.prototype.updateButton = function (sendEvent) {
        if (sendEvent === void 0) { sendEvent = true; }
        this.buttonElement.removeClass();
        if (this.loading) {
            this.buttonElement.addClass('coveo-icon-loading');
        }
        else if (this.isAttached()) {
            this.buttonElement.addClass('coveo-icon-attached');
        }
        else if (!this.options.readonly) {
            this.buttonElement.addClass('coveo-icon-attach');
        }
        if (this.options.readonly) {
            this.buttonElement.addClass('coveo-icon-readonly');
        }
        if (this.options.displayText) {
            this.textElement.text(this.isAttached() ? coveo_search_ui_1.l('Attached') : coveo_search_ui_1.l('Attach'));
        }
        if (sendEvent) {
            this.sendStateChangedEvent();
        }
    };
    AttachToCase.ID = 'AttachToCase';
    AttachToCase.fields = ['sfkbid', 'sfkbversionnumber', 'sflanguage'];
    /**
     * The possible options for AttachToCase
     * @componentOptions
     */
    AttachToCase.options = {
        /**
         * Specifies if the component should include the Attach/Detach text.
         *
         * Default value is `false`.
         *
         * ```html
         * <div data-display-text='true'/>
         * ```
         */
        displayText: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies if the component should be in read only mode. When in read only mode, you cannot Attach or Detach results.
         *
         * The default value is `false`.
         *
         * ```html
         * <div data-readonly='true'/>
         * ```
         */
        readonly: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        attachToCaseEndpoint: coveo_search_ui_1.ComponentOptions.buildCustomOption(function (name) { return function () { return window[name]; }; }, {
            defaultFunction: function () { return function () { return window['attachToCaseEndpoint']; }; }
        })
    };
    return AttachToCase;
}(coveo_search_ui_1.Component));
exports.AttachToCase = AttachToCase;
coveo_search_ui_1.Initialization.registerComponentFields(AttachToCase.ID, AttachToCase.fields);
coveo_search_ui_1.Initialization.registerAutoCreateComponent(AttachToCase);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
/**
 * Return the filtering expression to show only attached results.
 */
function getExpressions(attachedResults) {
    var builder = new coveo_search_ui_1.ExpressionBuilder();
    var sfkbids = [];
    var sysurihashs = [];
    attachedResults.forEach(function (result) {
        // Each result can either be an urihash or a sfkid
        isKnowledgeArticleId(result) ? sfkbids.push(result) : sysurihashs.push(result);
    });
    if (sysurihashs.length > 0) {
        builder.addFieldExpression('@urihash', '=', sysurihashs);
    }
    if (sfkbids.length > 0) {
        builder.addFieldExpression('@sfkbid', '=', sfkbids);
    }
    // In case we don't have any attached results
    if (sfkbids.length + sysurihashs.length == 0) {
        builder.add('NOT @uri');
    }
    return builder.build(' OR ');
}
exports.getExpressions = getExpressions;
/**
 * Returns true if the Id is from a KnowledeArticle document
 *
 * @param id The id to validate
 */
function isKnowledgeArticleId(id) {
    // A sfkbid should start with "ka" and either be
    // 15 or 18 char long (Salesforce IDs)
    return id.toLowerCase().indexOf('ka') == 0 && (id.length == 15 || id.length == 18);
}
exports.isKnowledgeArticleId = isKnowledgeArticleId;
/**
 * Handle incoming AttachToCase events from other components
 *
 * @param endpoint The local attachToCaseEndpoint
 * @param args The AttachToCase event argument
 * @param onChange A function to be called if the state changed
 */
function handleAttachToCaseEvent(endpoint, args, onChange) {
    if (endpoint && endpoint.caseId == args.dataToAttach.caseId) {
        var data = endpoint.data;
        var hasModification = false;
        if (data.succeeded) {
            // Add the document ID to our list of attached results since it was attached elsewhere.
            if (!_.contains(data.attachedResults, args.result.raw.urihash)) {
                data.attachedResults.push(args.result.raw.urihash);
                hasModification = true;
            }
            // Add the article ID to our list of attached results since it was attached elsewhere.
            var kbid = args.result.raw.sfkbid;
            if (kbid) {
                if (!_.contains(data.attachedResults, kbid)) {
                    data.attachedResults.push(kbid);
                    hasModification = true;
                }
            }
        }
        if (hasModification) {
            onChange(data);
        }
    }
}
exports.handleAttachToCaseEvent = handleAttachToCaseEvent;
/**
 * Handle incoming DetachFromCase events from other components
 *
 * @param endpoint The local attachToCaseEndpoint
 * @param args The DetachFromCase event arguments
 * @param onChange A function to be called if the state changed
 */
function handleDetachFromCase(endpoint, args, onChange) {
    if (endpoint && endpoint.caseId == args.caseId) {
        var data = endpoint.data;
        var hasModification = false;
        if (data.succeeded) {
            // Remove the document ID to our list of attached results since it was detached elsewhere.
            if (_.contains(data.attachedResults, args.result.raw.urihash)) {
                data.attachedResults.splice(data.attachedResults.indexOf(args.result.raw.urihash), 1);
                hasModification = true;
            }
            // Remove the article ID to our list of attached results since it was detached elsewhere.
            var kbid = args.result.raw.sfkbid;
            if (kbid && _.contains(data.attachedResults, kbid)) {
                data.attachedResults.splice(data.attachedResults.indexOf(kbid), 1);
                hasModification = true;
            }
        }
        if (hasModification) {
            onChange(data);
        }
    }
}
exports.handleDetachFromCase = handleDetachFromCase;
/**
 * Handle the data promise resolution.
 *
 * @param endpoint The local endpoint
 */
function handleEndpointDataPromise(endpoint) {
    var dataPromise = endpoint.data;
    var data = endpoint.data;
    if (dataPromise && dataPromise.then) {
        return dataPromise.then(function (d) {
            endpoint.data = d;
            return d;
        });
    }
    else if (data && data.succeeded) {
        return Promise.resolve(data);
    }
}
exports.handleEndpointDataPromise = handleEndpointDataPromise;


/***/ }),
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var AttachToCaseUtils = __webpack_require__(21);
var UserActionEvents_1 = __webpack_require__(11);
var AttachedResultsTab = /** @class */ (function (_super) {
    __extends(AttachedResultsTab, _super);
    function AttachedResultsTab(element, options, bindings) {
        var _this = _super.call(this, element, options, bindings) || this;
        _this.element = element;
        _this.options = options;
        $(_this.root).on(coveo_search_ui_1.QueryEvents.doneBuildingQuery, $.proxy(_this.handleDoneBuildingQueryForAttachedResults, _this));
        _this.bind.on(window, UserActionEvents_1.UserActionEvents.attachedResultChange, function (args) {
            return _this.handleAttachedResultChangeEvent(args);
        });
        if (typeof attachToCaseEndpoint != 'undefined' && attachToCaseEndpoint != null) {
            _this.setAttachToCaseEndpoint(attachToCaseEndpoint);
        }
        return _this;
    }
    AttachedResultsTab.prototype.setAttachToCaseEndpoint = function (endpoint) {
        if (endpoint != null) {
            this.attachToCaseEndpoint = endpoint;
        }
    };
    AttachedResultsTab.prototype.handleAttachedResultChangeEvent = function (args) {
        if (this.attachToCaseEndpoint.caseId == args.caseId) {
            var data = this.attachToCaseEndpoint.data;
            data.attachedResults = args.attachedResults;
        }
    };
    AttachedResultsTab.prototype.handleDoneBuildingQueryForAttachedResults = function (e, args) {
        if (!this.disabled && this.isSelected() && this.attachToCaseEndpoint) {
            var data = this.attachToCaseEndpoint.data;
            if (data.succeeded) {
                var expressionBuilder = new coveo_search_ui_1.ExpressionBuilder();
                expressionBuilder.add(AttachToCaseUtils.getExpressions(data.attachedResults));
                if (this.options.expression) {
                    expressionBuilder.add(this.options.expression);
                }
                // We need to clean the constant and advanced expression in
                // order to remove the context and other customizations
                // that would prevent this component from working.
                if (this.options.constant) {
                    args.queryBuilder.constantExpression = expressionBuilder;
                    args.queryBuilder.advancedExpression = new coveo_search_ui_1.ExpressionBuilder();
                }
                else {
                    args.queryBuilder.constantExpression = new coveo_search_ui_1.ExpressionBuilder();
                    args.queryBuilder.advancedExpression = expressionBuilder;
                }
            }
        }
    };
    AttachedResultsTab.ID = 'AttachedResultsTab';
    return AttachedResultsTab;
}(coveo_search_ui_1.Tab));
exports.AttachedResultsTab = AttachedResultsTab;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(AttachedResultsTab);


/***/ }),
/* 32 */,
/* 33 */,
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var ExtensionBuilder_1 = __webpack_require__(12);
var ExtensionSome = /** @class */ (function (_super) {
    __extends(ExtensionSome, _super);
    function ExtensionSome(element, options, bindings) {
        var _this = _super.call(this, element, ExtensionSome.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, ExtensionSome, options);
        if (!_.isUndefined(_this.options.keywords) && _this.options.bindOnQuery) {
            _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        }
        return _this;
    }
    ExtensionSome.fromStringArrayToStringKeywords = function (array, bindings) {
        return _.chain(array)
            .map(function (includeInQuery) {
            return bindings.container.options.record[includeInQuery.toLowerCase()];
        })
            .compact()
            .value()
            .join(' ');
    };
    ExtensionSome.prototype.getBuilder = function () {
        var builder = new ExtensionBuilder_1.ExtensionBuilder('some').withParam('keywords', this.options.keywords);
        if (!_.isUndefined(this.options.best)) {
            builder.withParam('best', this.options.best);
        }
        if (!_.isUndefined(this.options.match)) {
            builder.withParam('match', this.options.match);
        }
        if (!_.isUndefined(this.options.removeStopWords)) {
            builder.withParam('removeStopWords', this.options.removeStopWords);
        }
        if (!_.isUndefined(this.options.maximum)) {
            builder.withParam('maximum', this.options.maximum);
        }
        return builder;
    };
    ExtensionSome.prototype.handleBuildingQuery = function (args) {
        args.queryBuilder.advancedExpression.add(this.getBuilder().build());
    };
    ExtensionSome.ID = 'ExtensionSome';
    ExtensionSome.options = {
        keywords: coveo_search_ui_1.ComponentOptions.buildStringOption(),
        best: coveo_search_ui_1.ComponentOptions.buildNumberOption({ defaultValue: 5 }),
        match: coveo_search_ui_1.ComponentOptions.buildNumberOption({ defaultValue: 2 }),
        removeStopWords: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        maximum: coveo_search_ui_1.ComponentOptions.buildNumberOption(),
        bindOnQuery: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return ExtensionSome;
}(coveo_search_ui_1.Component));
exports.ExtensionSome = ExtensionSome;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(ExtensionSome);


/***/ }),
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var ExtensionBuilder_1 = __webpack_require__(12);
var ExtensionQRE = /** @class */ (function (_super) {
    __extends(ExtensionQRE, _super);
    function ExtensionQRE(element, options, bindings) {
        var _this = _super.call(this, element, ExtensionQRE.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, ExtensionQRE, options);
        if (!_.isUndefined(_this.options.expression) && !_.isUndefined(_this.options.modifier) && _this.options.bindOnQuery) {
            _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        }
        return _this;
    }
    ExtensionQRE.prototype.getBuilder = function () {
        return new ExtensionBuilder_1.ExtensionBuilder('qre', this.options.quotedExpression)
            .withParam('expression', this.options.expression)
            .withParam('modifier', this.options.modifier);
    };
    ExtensionQRE.prototype.handleBuildingQuery = function (args) {
        args.queryBuilder.advancedExpression.add(this.getBuilder().build());
    };
    ExtensionQRE.ID = 'ExtensionQRE';
    ExtensionQRE.options = {
        expression: coveo_search_ui_1.ComponentOptions.buildStringOption(),
        modifier: coveo_search_ui_1.ComponentOptions.buildNumberOption(),
        bindOnQuery: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        quotedExpression: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return ExtensionQRE;
}(coveo_search_ui_1.Component));
exports.ExtensionQRE = ExtensionQRE;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(ExtensionQRE);


/***/ }),
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(6);
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
var BoxStateModel_1 = __webpack_require__(16);
var Container_1 = __webpack_require__(52);
/**
 * The _Box_ component represents the container that includes all the other `box` components.
 *
 * It inherits from a [SearchInterface Component](https://coveo.github.io/search-ui/components/searchinterface.html) and supports all of its options.
 *
 * ```html
 * <div class='CoveoBox'></div>
 * ```
 */
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box(element, options, analyticsOptions, originalOptionsObject) {
        var _this = _super.call(this, element, coveo_search_ui_1.ComponentOptions.initComponentOptions(element, Box, options), analyticsOptions, originalOptionsObject) || this;
        _this.element = element;
        _this.options = options;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, Box, options);
        _this.salesforceContext = window['SalesforceContext'];
        if (!_this.options.record) {
            //Coveo.record will be populated when inside Salesforce, or by a mock variable in a dev/test environment
            if (_this.salesforceContext.record != undefined) {
                _this.options.record = _this.salesforceContext.record;
            }
        }
        if (!_this.options.type) {
            //Coveo.type will be populated when inside Salesforce, or by a mock variable in a dev/test environment
            if (_this.salesforceContext.type != undefined) {
                _this.options.type = _this.salesforceContext.type;
            }
        }
        if (_this.usageAnalytics) {
            _this.usageAnalytics.setOriginContext('AgentSearch');
        }
        _this.boxStateModel = new BoxStateModel_1.BoxStateModel(element);
        if (_this.options.enableBoxStateHistory) {
            if (_this.options.useLocalStorageForBoxState) {
                new coveo_search_ui_1.LocalStorageHistoryController(element, window, _this.boxStateModel, _this.queryController);
            }
            else {
                new coveo_search_ui_1.HistoryController(element, window, _this.boxStateModel, _this.queryController);
            }
            var eventFromQueryState = _this.queryStateModel.getEventName(coveo_search_ui_1.Model.eventTypes.changeOne + coveo_search_ui_1.QueryStateModel.attributesEnum.t);
            var eventFromBoxState = _this.boxStateModel.getSimpleEvent(BoxStateModel_1.BoxStateModel.attributesEnum.t);
            $(_this.element).on(coveo_search_ui_1.InitializationEvents.restoreHistoryState, function () {
                $(_this.element).on(eventFromQueryState, function (e, args) {
                    _this.boxStateModel.set(BoxStateModel_1.BoxStateModel.attributesEnum.t, args.value);
                });
            });
            $(_this.element).on(eventFromBoxState, function (e, args) {
                _this.queryStateModel.set(coveo_search_ui_1.QueryStateModel.attributesEnum.t, args.value);
            });
        }
        _this.resize();
        _this.resizeHandler = function () { return _this.resize(); };
        $(window).resize(_this.resizeHandler);
        $(_this.element).on(coveo_search_ui_1.InitializationEvents.nuke, function () { return _this.handleNuke(); });
        coveo_search_ui_1.Assert.exists(_this.options.type);
        $(_this.element).addClass(coveo_search_ui_1.Component.computeCssClassNameForType(Box.ID));
        return _this;
    }
    /**
     * Triggers a resize of the box so that it occupies the full page height and width. This is automatically called whenever the page is resized.
     *
     * ```js
     * $('#MyCoveoBox').coveo('resize')
     * ```
     */
    Box.prototype.resize = function () {
        $(this.element).outerHeight($(window).height() - 10);
    };
    Box.prototype.initializeAnalytics = function () {
        var analyticsClass = coveo_search_ui_1.Component.computeCssClassNameForType(coveo_search_ui_1.Analytics.ID);
        if (this.options.withAnalytics && $(this.element).find('.' + analyticsClass).length == 0) {
            $('<div/>')
                .addClass(analyticsClass)
                .appendTo(this.element);
        }
        else if (!this.options.withAnalytics) {
            $(this.element)
                .find('.' + analyticsClass)
                .remove();
        }
        return _super.prototype.initializeAnalytics.call(this);
    };
    Box.prototype.getBindings = function () {
        return _.extend(_super.prototype.getBindings.call(this), {
            boxStateModel: this.boxStateModel,
            isWaitingForRecord: this.options.record == undefined
        });
    };
    Box.prototype.handleNuke = function () {
        $(window).off('resize', this.resizeHandler);
    };
    Box.ID = 'Box';
    /**
     * The possible options for Box
     * @componentOptions
     */
    Box.options = {
        type: coveo_search_ui_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies if the box should automatically include an `analytics` component.
         *
         * If you already have one on the page, then it is not added twice. However, setting it to `false` removes it from the page on initialization.
         *
         * Default value is `true`.
         *
         * ```html
         * <div data-with-analytics="true"></div>
         * ```
         */
        withAnalytics: coveo_search_ui_1.ComponentOptions.buildBooleanOption({
            defaultValue: true
        }),
        /**
         * Specifies if you wish to use the local storage to save the box state. This means that the query state is only loaded on page load.
         *
         * Default value is `true`.
         *
         * ```html
         * <div data-use-local-storage-for-box-state="true"></div>
         * ```
         */
        useLocalStorageForBoxState: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies if you wish to save and reload the `Box` state when the page is closed and reopened.
         *
         * This saves the current state of the current tab that is selected.
         *
         * If set to `false`, the tab reverts to the default one on each page load.
         *
         * If set to `true`, each time you reload the page, the last tab that you selected will be automatically selected.
         *
         * Default value is `true`.
         *
         * ```html
         * <div data-enable-box-state-history="true"></div>
         * ```
         */
        enableBoxStateHistory: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies the length (in characters) of the result text (excerpt) to display.
         *
         * Default value is `80`.
         *
         * Minimum value is `0`.
         *
         * ```html
         * <div data-excerpt-length="80"></div>
         * ```
         */
        excerptLength: coveo_search_ui_1.ComponentOptions.buildNumberOption({ defaultValue: 80, min: 0 }),
        /**
         * Specifies the number of results you want per page.
         *
         * Default value is `20`.
         *
         * Minimum value is `0`.
         *
         * ```html
         * <div data-results-per-page="20"></div>
         * ```
         */
        resultsPerPage: coveo_search_ui_1.ComponentOptions.buildNumberOption({ defaultValue: 20, min: 0 }),
        // Change after Box can support the automatic responsive mode correctly
        /**
         * Whether the component should automatically adapt to the screen size.
         *
         * Default value is `true`.
         *
         * ```html
         * <div data-enable-automatic-reponsive-mode="true"></div>
         * ```
         */
        enableAutomaticResponsiveMode: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return Box;
}(Container_1.Container));
exports.Box = Box;
// The options are extended here to ensure TypeDoc builds the documentation properly.
Box.options = _.extend({}, Container_1.Container.options, Box.options);


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
/**
 * The _BoxEditLink_ component provides a clickable button that expands the current interface to another page that contains the Interface Editor.
 *
 * ```html
 * <a class='CoveoBoxEditLink'></a>
 * ```
 */
var BoxEditLink = /** @class */ (function (_super) {
    __extends(BoxEditLink, _super);
    function BoxEditLink(element, options, bindings) {
        var _this = _super.call(this, element, BoxEditLink.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxEditLink, options);
        if (bindings.isWaitingForRecord) {
            _this.logger.info('Disabling component : No record found to expand query', _this);
            return _this;
        }
        if (coveo_search_ui_1.Utils.isNonEmptyString(_this.options.uri)) {
            _this.bindAnalyticsEvent();
            _this.setBaseHref();
            _this.appendIcon();
        }
        else {
            _this.logger.warn('No url set for the edition. Inside salesforce ? Current user probably does not have the modifyAllData permission needed to edit the page');
            $(_this.element).remove();
        }
        return _this;
    }
    BoxEditLink.getMarkup = function () {
        return $('<a class="CoveoBoxEditLink"></a>');
    };
    BoxEditLink.prototype.setBaseHref = function () {
        if (coveo_search_ui_1.Utils.isNonEmptyString(this.options.uri)) {
            var box = this.bindings.container;
            var queryString = _.chain(this.options.queryStringParams)
                .map(function (value, key) {
                if (value == '' || value == null) {
                    return null;
                }
                return [encodeURIComponent(key), encodeURIComponent(value)].join('=');
            })
                .compact()
                .value()
                .join('&');
            var href = [this.options.uri, queryString].join('?');
            $(this.element).attr('href', href);
        }
    };
    BoxEditLink.prototype.bindAnalyticsEvent = function () {
        var _this = this;
        $(this.element).click(function () {
            _this.bindings.usageAnalytics.logCustomEvent({ name: 'boxEdit', type: 'box' }, {}, _this.element);
        });
    };
    BoxEditLink.prototype.appendIcon = function () {
        $(this.element).append('<span class="coveo-icon ' + this.options.icon + '"></span><span>' + this.options.text + '</span>');
    };
    BoxEditLink.ID = 'BoxEditLink';
    /**
     * The possible options for BoxEditLink
     * @componentOptions
     */
    BoxEditLink.options = {
        /**
         * Specifies the URI of the page that hosts the Interface Editor.
         *
         * This option is normally already set for you when you include the Box Visualforce Component.
         *
         * ```html
         * <a data-uri='/apex/InterfaceEditor'></a>
         * ```
         */
        uri: coveo_search_ui_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the icon that the component should use.
         *
         * Default value is `coveo-sprites-box-settings`.
         *
         * ```html
         * <a data-icon='coveo-sprites-box-settings'></a>
         * ```
         */
        icon: coveo_search_ui_1.ComponentOptions.buildIconOption({ defaultValue: 'coveo-sprites-box-settings_gray' }),
        /**
         * Specifies the text to display alongside the icon.
         *
         * Default value is the localized string for `GoToEdition`.
         *
         * ```html
         * <a data-text='My text'></a>
         * ```
         */
        text: coveo_search_ui_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: coveo_search_ui_1.l('GoToEdition') })
    };
    return BoxEditLink;
}(coveo_search_ui_1.Component));
exports.BoxEditLink = BoxEditLink;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxEditLink);


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
var SalesforceUtils_1 = __webpack_require__(7);
var SalesforceContext_1 = __webpack_require__(15);
/**
 * The _BoxExpandLink_ component takes care of creating a clickable link that expands to a full search interface page.
 *
 * It also takes care of sending the current state of the Box component to the full search interface so that you get the same (or a similar) result set when the full search page loads.
 *
 * ```html
 * <a class="CoveoBoxExpandLink" target="_blank"></a>
 * ```
 */
var BoxExpandLink = /** @class */ (function (_super) {
    __extends(BoxExpandLink, _super);
    function BoxExpandLink(element, options, bindings) {
        var _this = _super.call(this, element, BoxExpandLink.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxExpandLink, options);
        if (coveo_search_ui_1.Utils.isNonEmptyString(_this.options.uri)) {
            _this.bindAnalyticsEvent();
            _this.setBaseHref();
            _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.doneBuildingQuery, function (args) {
                _this.setNewHref(args);
            });
            if (SalesforceUtils_1.SalesforceUtilities.isInSalesforceConsole()) {
                $(_this.element).click(function (e) {
                    e.preventDefault();
                    SalesforceUtils_1.SalesforceUtilities.focusOrOpenTab(_this.currentHref, _this.options.title, _this.options.toPrimaryTab);
                });
            }
            _this.appendIcon();
        }
        else {
            _this.logger.warn('Cannot initialized Box Expand Link : uri is undefined ');
            _this.logger.warn('Inside salesforce ? Configure the search page inside the package');
        }
        return _this;
    }
    BoxExpandLink.getMarkup = function () {
        return $('<a class="CoveoBoxExpandLink" target="_blank"></a>');
    };
    BoxExpandLink.prototype.appendIcon = function () {
        $(this.element).append('<span class="' + this.options.icon + '"></span><span>' + this.options.text + '</span>');
    };
    BoxExpandLink.prototype.getHd = function () {
        var hd = '';
        if (this.options.hd && !this.bindings.isWaitingForRecord) {
            var box = this.bindings.container;
            if (box.options.record) {
                hd = SalesforceUtils_1.SalesforceUtilities.expandStringUsingRecord(coveo_search_ui_1.Utils.decodeHTMLEntities(this.options.hd), box.options.record);
            }
        }
        return hd;
    };
    BoxExpandLink.prototype.getHq = function (q, args) {
        var hq = '';
        if (!this.bindings.isWaitingForRecord) {
            if (Coveo.Utils.isNonEmptyString(q)) {
                hq = args.queryBuilder.computeCompleteExpressionPartsExcept(q).withoutConstant;
            }
            else {
                hq = args.queryBuilder.computeCompleteExpressionParts().withoutConstant;
            }
        }
        return hq;
    };
    BoxExpandLink.prototype.setBaseHref = function () {
        var href = this.buildHrefFromArguments(this.options.uri, { t: this.getTargetTab(), hd: this.getHd() });
        $(this.element).attr('href', href);
        this.baseHref = this.options.uri;
        if (!this.bindings.isWaitingForRecord && SalesforceContext_1.getSalesforceContext().record.id.substr(0, 3) == '500') {
            var indexOfQuestionMark = this.baseHref.indexOf('?');
            var indexOfHash = this.baseHref.indexOf('#');
            if (this.baseHref.indexOf('?caseId=') == -1) {
                if (indexOfQuestionMark >= 0) {
                    this.baseHref = this.baseHref.replace('?', '?caseId=' + encodeURI(SalesforceContext_1.getSalesforceContext().record.id) + '&');
                }
                else if (indexOfHash >= 0) {
                    this.baseHref = this.baseHref.replace('#', '?caseId=' + encodeURI(SalesforceContext_1.getSalesforceContext().record.id) + '#');
                }
                else {
                    this.baseHref += '?caseId=' + encodeURI(SalesforceContext_1.getSalesforceContext().record.id);
                }
            }
        }
        this.currentHref = href;
    };
    BoxExpandLink.prototype.setNewHref = function (args) {
        var q = this.bindings.queryStateModel.get(coveo_search_ui_1.QueryStateModel.attributesEnum.q);
        var href = this.buildHrefFromArguments(this.baseHref, {
            q: q,
            hq: this.getHq(q, args),
            t: this.getTargetTab(),
            hd: this.getHd()
        });
        this.currentHref = href;
        $(this.element).attr('href', href);
    };
    BoxExpandLink.prototype.extractBaseHrefFromBaseUri = function (baseHref, hashArguments) {
        var keysFromBase = [], valuesFromBase = [], baseSplit = baseHref.split('#');
        if (baseSplit[1] != undefined) {
            var baseHashSplit = baseSplit[1].split('&');
            _.each(baseHashSplit, function (onePair) {
                var pairSplit = onePair.split('=');
                keysFromBase.push(pairSplit[0]);
                valuesFromBase.push(pairSplit[1]);
            });
        }
        var toMerge = _.object(keysFromBase, valuesFromBase);
        var merged = _.extend({}, toMerge, hashArguments);
        return {
            base: baseSplit[0],
            hashArguments: merged
        };
    };
    BoxExpandLink.prototype.buildHrefFromArguments = function (baseHref, hashArguments) {
        var extracted = this.extractBaseHrefFromBaseUri(baseHref, hashArguments);
        return [
            extracted.base,
            _.chain(extracted.hashArguments)
                .map(function (v, k) {
                if (v == undefined || v == '' || v == 'undefined') {
                    return undefined;
                }
                else {
                    return [k, encodeURIComponent(v)].join('=');
                }
            })
                .compact()
                .value()
                .join('&')
        ]
            .join('#')
            .replace(/#$/, '');
    };
    BoxExpandLink.prototype.bindAnalyticsEvent = function () {
        var _this = this;
        $(this.element).click(function () {
            _this.bindings.usageAnalytics.logCustomEvent(coveo_search_ui_1.analyticsActionCauseList.expandToFullUI, {}, _this.element);
            return true;
        });
    };
    BoxExpandLink.prototype.getTargetTab = function () {
        if (this.options.targetTab) {
            return this.options.targetTab;
        }
        return this.queryStateModel.get(coveo_search_ui_1.QueryStateModel.attributesEnum.t) || '';
    };
    BoxExpandLink.ID = 'BoxExpandLink';
    /**
     * The possible options for BoxExpandLink
     * @componentOptions
     */
    BoxExpandLink.options = {
        /**
         * Specifies the URI of the full search page to load when the user expands the `Box`.
         *
         * Most of the time, you do not have to specify a value manually for this option. The Box Visualforce Component already takes care of setting this option correctly.
         *
         * ```html
         * <div data-uri='https://mysalesforce.na15.visual.force.com/apex/CoveoSearch'></div>
         * ```
         */
        uri: coveo_search_ui_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the title to display in the tab or sub tab that opens inside the Salesforce console when the user clicks the component to expand the `Box`.
         *
         * Default value is the localized string for `Coveo Search`.
         *
         * ```html
         * <div data-title='Search Page'></div>
         * ```
         */
        title: coveo_search_ui_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: coveo_search_ui_1.l('Coveo Search') }),
        /**
         * Specifies the description to display when the full search page loads with a context filter.
         *
         * Default value is the localized string for `Context`.
         *
         * ```html
         * <div data-hd='Context'></div>
         * ```
         */
        hd: coveo_search_ui_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: coveo_search_ui_1.l('Context') }),
        /**
         * Specifies the `id` of the `Tab` component to load in the full search page when the user expands the box.
         *
         * Default value is `undefined`, and the component uses the current `Tab` component as its `targetTab` when the user expands the box to a full search page.
         *
         * ```html
         * <div data-target-tab='SomeTabId'></div>
         * ```
         */
        targetTab: coveo_search_ui_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the CSS class of the icon to display on the expand button.
         *
         * Default value is `coveo-icon coveo-sprites-box-icon_external`.
         *
         * ```html
         * <div data-icon='custom-icon'></div>
         * ```
         */
        icon: coveo_search_ui_1.ComponentOptions.buildIconOption({ defaultValue: 'coveo-icon coveo-sprites-box-icon_external' }),
        /**
         * Specifies the text content to add inside the icon HTML element.
         *
         * Default value is the localized string for `GoToFullSearch`.
         *
         * ```html
         * <div data-text='Go To Full Search'></div>
         * ```
         */
        text: coveo_search_ui_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: coveo_search_ui_1.l('GoToFullSearch') }),
        /**
         * Specifies whether to open the full search page as a primary or as a sub tab inside the Salesforce console.
         *
         * Default value is `true`.
         *
         * Setting this option to `false` makes the full search page open as a sub tab inside the Salesforce console.
         *
         * ```html
         * <div data-to-primary-tab='false'></div>
         * ```
         */
        toPrimaryTab: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return BoxExpandLink;
}(coveo_search_ui_1.Component));
exports.BoxExpandLink = BoxExpandLink;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxExpandLink);


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
var BoxEditLink_1 = __webpack_require__(48);
var BoxExpandLink_1 = __webpack_require__(49);
var BoxStateModel_1 = __webpack_require__(16);
var BoxQuerySummary_1 = __webpack_require__(54);
var SalesforceContext_1 = __webpack_require__(15);
/**
 * The _BoxHeader_ component takes care of instantiating a `Searchbox` component with preconfigured options and a placeholder (see [Coveo Searchbox Component](https://coveo.github.io/search-ui/components/searchbox.html)).
 *
 * Optionally, this component can also display a **Remove context** checkbox. You should normally place this component at the top of your box.
 *
 * ```html
 * <div class='CoveoBoxHeader'></div>
 * ```
 */
var BoxHeader = /** @class */ (function (_super) {
    __extends(BoxHeader, _super);
    function BoxHeader(element, options, bindings, id) {
        if (id === void 0) { id = BoxHeader.ID; }
        var _this = _super.call(this, element, id, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.id = id;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxHeader, options);
        _this.buildSubSection();
        if (_this.options.allowNonContextualSearch) {
            _this.buildContextualSearchInput();
        }
        // We need to preprocess the non contextual search attribute
        // Here is the desired behavior :
        // On page load, the state of the non contextual search is loaded from local storage
        // BUT : We only want to apply it if the search box is empty
        // If it's enabled at page load and the query is empty, we set it to false, but execute the swap
        // the next time that a query is performed in the search box
        var bindOnce = _.once(function () {
            var eventOnNextQChange = _this.queryStateModel.getEventName(coveo_search_ui_1.Model.eventTypes.changeOne + coveo_search_ui_1.QueryStateModel.attributesEnum.q);
            _this.bind.onRootElement(eventOnNextQChange, function (args) {
                if (args.value) {
                    _this.bindings.boxStateModel.set(BoxStateModel_1.BoxStateModel.attributesEnum.enableNonContextualSearch, true);
                }
            });
        });
        var preprocessContextualSearch = _this.bindings.boxStateModel.getEventName(coveo_search_ui_1.Model.eventTypes.preprocess);
        _this.bind.onRootElement(preprocessContextualSearch, function (args) {
            if (!_this.options.allowNonContextualSearch) {
                args.enableNonContextualSearch = false;
            }
            else if (args.enableNonContextualSearch && _this.queryStateModel.get(coveo_search_ui_1.QueryStateModel.attributesEnum.q) == '') {
                args.enableNonContextualSearch = false;
                bindOnce();
            }
        });
        _this.buildSearchBoxSection();
        return _this;
    }
    BoxHeader.getMarkup = function () {
        var expandLink = BoxExpandLink_1.BoxExpandLink.getMarkup();
        var editLink = BoxEditLink_1.BoxEditLink.getMarkup();
        var ret = $("<div class='CoveoBoxHeader'></div>");
        ret.append(editLink);
        ret.append(expandLink);
        return ret;
    };
    BoxHeader.prototype.buildContextualSearchInput = function () {
        var _this = this;
        var querySummary = this.subSection.find(coveo_search_ui_1.Component.computeSelectorForType(BoxQuerySummary_1.BoxQuerySummary.ID));
        this.nonContextualSearchToggle = $('<div class="coveo-contextual-results-toggle"><label>' +
            coveo_search_ui_1.l('RemoveContext') +
            '<input type="checkbox" /><div class="coveo-switch"></div></label></div>').addClass('coveo-hidden');
        if (querySummary.length != 0) {
            this.nonContextualSearchToggle.insertAfter(querySummary);
        }
        else {
            this.nonContextualSearchToggle.appendTo(this.subSection);
        }
        this.bind.onRootElement(this.queryStateModel.getEventName(coveo_search_ui_1.Model.eventTypes.changeOne + coveo_search_ui_1.QueryStateModel.attributesEnum.q), function (args) {
            if (args.value) {
                _this.nonContextualSearchToggle.removeClass('coveo-hidden');
            }
            else {
                _this.nonContextualSearchToggle.addClass('coveo-hidden');
            }
        });
        this.bind.onRootElement(this.bindings.boxStateModel.getSimpleEvent(BoxStateModel_1.BoxStateModel.attributesEnum.enableNonContextualSearch), function (args) {
            _this.nonContextualSearchToggle.find('input:checkbox').prop('checked', args.value);
            _this.toggleFancySwitch(args.value);
        });
        this.nonContextualSearchToggle.find('input:checkbox').change(function (e) {
            var checked = $(e.target).prop('checked');
            _this.bindings.boxStateModel.set(BoxStateModel_1.BoxStateModel.attributesEnum.enableNonContextualSearch, checked);
            if (checked) {
                _this.usageAnalytics.logSearchEvent(coveo_search_ui_1.analyticsActionCauseList.casecontextAdd, {
                    caseID: SalesforceContext_1.getSalesforceContext().record.id
                });
            }
            else {
                _this.usageAnalytics.logSearchEvent(coveo_search_ui_1.analyticsActionCauseList.casecontextRemove, {
                    caseID: SalesforceContext_1.getSalesforceContext().record.id
                });
            }
            _this.toggleFancySwitch(checked);
            _this.queryController.executeQuery();
        });
    };
    BoxHeader.prototype.toggleFancySwitch = function (activate) {
        this.nonContextualSearchToggle.find('.coveo-switch').toggleClass('coveo-active', activate);
    };
    BoxHeader.prototype.buildSubSection = function () {
        var subSectionWrapper = $('<div></div>').addClass('coveo-box-header-sub-section-wrapper');
        this.subSection = $('<div></div>').addClass('coveo-box-header-sub-section');
        $(this.element)
            .children()
            .appendTo(this.subSection);
        subSectionWrapper.append(this.subSection);
        $(this.element).append(subSectionWrapper);
    };
    BoxHeader.prototype.buildSearchbox = function (container) {
        var searchboxDiv = $('<div class="' + coveo_search_ui_1.Component.computeCssClassNameForType(coveo_search_ui_1.Searchbox.ID) + '"></div>');
        $(container).append(searchboxDiv);
        var searchboxOptions = _.extend({}, this.options, this.bindings.container.originalOptionsObject.Searchbox);
        if (searchboxOptions == undefined) {
            searchboxOptions = {};
        }
        if (searchboxOptions.enableSearchAsYouType == undefined) {
            searchboxOptions.enableSearchAsYouType = true;
        }
        if (searchboxOptions.autoFocus == undefined) {
            searchboxOptions.autoFocus = false;
        }
        if (searchboxOptions.enableOmnibox == undefined) {
            searchboxOptions.enableOmnibox = false;
        }
        var searchbox = new coveo_search_ui_1.Searchbox(searchboxDiv.get(0), searchboxOptions, this.bindings);
        $(searchbox.element)
            .find('input')
            .attr('placeholder', this.options.placeholder);
        return searchbox;
    };
    BoxHeader.prototype.buildSettings = function (container) {
        var settingsDiv = document.createElement('div');
        $(container).append(settingsDiv);
        var settingsOptions = _.extend({}, this.options, this.bindings.container.originalOptionsObject.Settings);
        var settings = new coveo_search_ui_1.Settings(settingsDiv, settingsOptions, this.bindings);
        return settings;
    };
    BoxHeader.prototype.buildSearchBoxSection = function () {
        var sectionDiv = document.createElement('div');
        sectionDiv.className = 'coveo-box-header-searchbox-section-wrapper';
        if (this.options.includeSearchbox) {
            this.searchbox = this.buildSearchbox(sectionDiv);
        }
        if (this.options.includeSettings) {
            var settingsContainer = document.createElement('div');
            settingsContainer.className = 'coveo-box-header-settings-section-wrapper';
            this.settings = this.buildSettings(settingsContainer);
            $(sectionDiv).append(settingsContainer);
        }
        $(this.element).prepend(sectionDiv);
    };
    BoxHeader.ID = 'BoxHeader';
    /**
     * The possible options for BoxHeader
     * @componentOptions
     */
    BoxHeader.options = {
        /**
         * Specifies whether to initialize a Searchbox component.
         *
         * Default value is `true`.
         *
         * When this option is set to `true`, the component initializes a Searchbox component with the `enableSearchAsYouType` and `searchAsYouTypeDelay` options.
         *
         * ```html
         * <div data-include-search-box='true'></div>
         * ```
         */
        includeSearchbox: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Whether to include the settings icon, which is usually to the right of the search box.
         *
         * Default value is `false`.
         *
         * ```html
         * <div data-include-settings="false"></div>
         * ```
         */
        includeSettings: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * When the `includeSearchbox` option is enabled, activates the search-as-you-type feature for the search box.
         *
         * Default value is `true`.
         *
         * ```html
         * <div data-enable-search-as-you-type="true"></div>
         * ```
         */
        enableSearchAsYouType: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * When `includeSearchbox` is `true`, specifies the placeholder to set in the `Searchbox`.
         *
         * Default value is the localized string for `Search`.
         *
         * ```html
         * <div data-placeholder='Enter your query here'></div>
         * ```
         */
        placeholder: coveo_search_ui_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Search'.toLocaleString() }),
        /**
         * When `includeSearchbox` is `true`, specifies whether to display a **Remove context** checkbox when the end user starts typing in the search box.
         *
         * When checked, this checkbox removes the part of the query expression that was added by the query components.
         *
         * **Example:**
         *
         * > When a user opens a case about a `Power Generator`, items related to the `Power Generator` are shown. When the user starts typing the search box while `allowNonContextualSearch` is `true`, a checkbox will appear to allow them to disable the query and show items outside of the `Power Generator` scope.
         *
         * Default is `false`.
         *
         * ```html
         * <div data-allow-non-contextual-search='true'></div>
         * ```
         */
        allowNonContextualSearch: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * When the `includeSearchbox` and `enableSearchAsYouType` options are enabled, specifies the amount of time, in miliseconds, before refreshing the query based on what the user has typed.
         *
         * Minimum value is `0`.
         *
         * Default value is `300`.
         *
         * ```html
         * <div data-search-as-you-type-delay="300"></div>
         * ```
         */
        searchAsYouTypeDelay: coveo_search_ui_1.ComponentOptions.buildNumberOption({ defaultValue: 300, min: 0 })
    };
    return BoxHeader;
}(coveo_search_ui_1.Component));
exports.BoxHeader = BoxHeader;
// The options are extended here to ensure TypeDoc builds the documentation properly.
BoxHeader.options = _.extend({}, coveo_search_ui_1.Searchbox.options, BoxHeader.options);
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxHeader);


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var BoxStateModel_1 = __webpack_require__(16);
var SalesforceUtils_1 = __webpack_require__(7);
var SalesforceContext_1 = __webpack_require__(15);
var ExtensionQRE_1 = __webpack_require__(42);
var ExtensionQRF_1 = __webpack_require__(55);
var ExtensionQF_1 = __webpack_require__(56);
var SupportedBoxQueryExtension;
(function (SupportedBoxQueryExtension) {
    SupportedBoxQueryExtension[SupportedBoxQueryExtension["QRE"] = 0] = "QRE";
    SupportedBoxQueryExtension[SupportedBoxQueryExtension["QRF"] = 1] = "QRF";
    SupportedBoxQueryExtension[SupportedBoxQueryExtension["QF"] = 2] = "QF";
})(SupportedBoxQueryExtension = exports.SupportedBoxQueryExtension || (exports.SupportedBoxQueryExtension = {}));
var BoxQueryExtensions = /** @class */ (function (_super) {
    __extends(BoxQueryExtensions, _super);
    function BoxQueryExtensions(element, options, bindings) {
        var _this = _super.call(this, element, BoxQueryExtensions.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.extensions = [];
        _this.isDisabledFromContextualQuery = false;
        if (bindings.isWaitingForRecord) {
            _this.logger.info('Disabling component : No record found to expand query', _this);
            return _this;
        }
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxQueryExtensions, options);
        _this.options.configurations = _.extend({}, options.configurations, BoxQueryExtensions.getConfigFromContent(_this.element));
        _.each(_this.options.configurations, function (configuration) {
            if (configuration) {
                if (configuration.extension == SupportedBoxQueryExtension.QRE) {
                    _this.buildQREExtension(configuration.definition);
                }
                else if (configuration.extension == SupportedBoxQueryExtension.QRF) {
                    _this.buildQRFExtension(configuration.definition);
                }
                else if (configuration.extension == SupportedBoxQueryExtension.QF) {
                    _this.buildQFExtension(configuration.definition);
                }
            }
        });
        if (_this.options.disableOnNonContextualSearch) {
            _this.bind.onRootElement(_this.bindings.boxStateModel.getSimpleEvent(BoxStateModel_1.BoxStateModel.attributesEnum.enableNonContextualSearch), function (args) {
                _this.isDisabledFromContextualQuery = args.value;
                if (args.value) {
                    _.each(_this.extensions, function (e) { return e.disable(); });
                }
                else if (!_this.disabled) {
                    _.each(_this.extensions, function (e) { return e.enable(); });
                }
            });
        }
        return _this;
    }
    BoxQueryExtensions.getMarkup = function () {
        return $("<script class='CoveoBoxQueryExtensions' type='text/x-query-configuration' ></script>");
    };
    BoxQueryExtensions.getConfigFromContent = function (content) {
        if (content instanceof HTMLElement) {
            content = content.innerHTML;
        }
        var configFromJson = [];
        if (content != '') {
            try {
                // Can be HTML Encoded to escape special char is SF
                configFromJson = JSON.parse(coveo_search_ui_1.Utils.decodeHTMLEntities(content));
            }
            catch (e) {
                try {
                    configFromJson = JSON.parse(content);
                }
                catch (e) {
                    configFromJson = [];
                }
            }
        }
        return configFromJson;
    };
    BoxQueryExtensions.prototype.buildQREExtension = function (qreConfiguration) {
        this.extensions.push(new ExtensionQRE_1.ExtensionQRE($('<div />').get(0), {
            expression: SalesforceUtils_1.SalesforceUtilities.expandStringUsingRecord(qreConfiguration.expression, SalesforceContext_1.getSalesforceContext().record),
            modifier: qreConfiguration.modifier
        }, this.bindings));
    };
    BoxQueryExtensions.prototype.buildQRFExtension = function (qrfConfiguration) {
        this.extensions.push(new ExtensionQRF_1.ExtensionQRF($('<div />').get(0), {
            expression: SalesforceUtils_1.SalesforceUtilities.expandStringUsingRecord(qrfConfiguration.expression, SalesforceContext_1.getSalesforceContext().record),
            normalizeWeight: qrfConfiguration.normalizeWeight
        }, this.bindings));
    };
    BoxQueryExtensions.prototype.buildQFExtension = function (qfConfiguration) {
        this.extensions.push(new ExtensionQF_1.ExtensionQF($('<div />').get(0), {
            func: SalesforceUtils_1.SalesforceUtilities.expandStringUsingRecord(qfConfiguration.func, SalesforceContext_1.getSalesforceContext().record),
            fieldName: qfConfiguration.fieldName
        }, this.bindings));
    };
    BoxQueryExtensions.prototype.enable = function () {
        if (!this.isDisabledFromContextualQuery) {
            _.each(this.extensions, function (e) { return e.enable(); });
        }
        _super.prototype.enable.call(this);
    };
    BoxQueryExtensions.prototype.disable = function () {
        _.each(this.extensions, function (e) { return e.disable(); });
        _super.prototype.disable.call(this);
    };
    BoxQueryExtensions.ID = 'BoxQueryExtensions';
    BoxQueryExtensions.options = {
        disableOnNonContextualSearch: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return BoxQueryExtensions;
}(coveo_search_ui_1.Component));
exports.BoxQueryExtensions = BoxQueryExtensions;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxQueryExtensions);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container(element, options, analyticsOptions, originalOptionsObject) {
        var _this = _super.call(this, element, coveo_search_ui_1.ComponentOptions.initComponentOptions(element, Container, options), analyticsOptions, window) || this;
        _this.element = element;
        _this.originalOptionsObject = originalOptionsObject;
        return _this;
    }
    Container.prototype.addGlobalContext = function (key, context) {
        if (this.context[key] != undefined) {
            this.logger.info('Context for ' + key + ' is already set. Replacing', context);
        }
        this.context[key] = context;
    };
    Container.prototype.getGlobalContext = function (key) {
        coveo_search_ui_1.Assert.isNotUndefined(this.context[key]);
        return this.context[key];
    };
    Container.prototype.injectContainerHeader = function (injection) {
        if (injection.headerKlass) {
            var markup = injection.headerKlass.getMarkup();
            markup.addClass('coveo-container-header');
            $(this.element).append(markup);
        }
    };
    Container.prototype.injectContainerBody = function (injection) {
        if (injection.bodyKlass) {
            var markup = injection.bodyKlass.getMarkup();
            markup.addClass('coveo-container-body');
            $(this.element).append(markup);
        }
    };
    Container.prototype.injectContainerFooter = function (injection) {
        if (injection.footerKlass) {
            var markup = injection.footerKlass.getMarkup();
            markup.addClass('coveo-container-footer');
            $(this.element).append(markup);
        }
    };
    Container.prototype.injectContainerQuery = function (injection) {
        if (injection.queryKlass) {
            var markup = injection.queryKlass.getMarkup();
            $(this.element).append(markup);
        }
    };
    Container.prototype.injectContainerContext = function (injection) {
        if (injection.contextKlass) {
            var markup = injection.contextKlass.getMarkup();
            $(this.element).append(markup);
        }
    };
    Container.prototype.injectContainerSidePanel = function (injection) {
        if (injection.sidePanelKlass) {
            var markup = injection.sidePanelKlass.getMarkup();
            $(this.element).append(markup);
        }
    };
    Container.prototype.getBindings = function () {
        return _.extend(_super.prototype.getBindings.call(this), {
            container: this
        });
    };
    Container.options = _.extend({}, coveo_search_ui_1.SearchInterface.options);
    return Container;
}(coveo_search_ui_1.SearchInterface));
exports.Container = Container;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
/**
 * The _BoxFieldTable_ component is meant to be included inside a [ResultList Component](https://coveo.github.io/search-ui/components/resultlist.html).
 *
 * ```html
 * <div class='CoveoBoxFieldTable'></div>
 * ```
 */
var BoxFieldTable = /** @class */ (function (_super) {
    __extends(BoxFieldTable, _super);
    function BoxFieldTable(element, options, bindings, result) {
        var _this = _super.call(this, element, options, bindings, result) || this;
        _this.element = element;
        _this.options = options;
        $(_this.element).addClass(coveo_search_ui_1.Component.computeCssClassNameForType(coveo_search_ui_1.FieldTable.ID));
        return _this;
    }
    BoxFieldTable.prototype.isTogglable = function () {
        return this.options.allowMinimization;
    };
    BoxFieldTable.ID = 'BoxFieldTable';
    return BoxFieldTable;
}(coveo_search_ui_1.FieldTable));
exports.BoxFieldTable = BoxFieldTable;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxFieldTable);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
var BoxHeader_1 = __webpack_require__(50);
var BoxStateModel_1 = __webpack_require__(16);
/**
 * The _BoxQuerySummary_ component inherits from the `QuerySummary` component (see [Coveo QuerySummary Component](https://coveo.github.io/search-ui/components/querysummary.html)).
 *
 * Its only added functionality is to display the range of currently displayed results when the result list is using infinite scrolling.
 *
 * ```html
 * <div class='CoveoBoxQuerySummary'></div>
 * ```
 */
var BoxQuerySummary = /** @class */ (function (_super) {
    __extends(BoxQuerySummary, _super);
    function BoxQuerySummary(element, options, bindings) {
        var _this = _super.call(this, element, BoxQuerySummary.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxQuerySummary, options);
        var renderThrottle = _.throttle(function () { return _this.render(); }, 500, { leading: false, trailing: true });
        _this.bind.onRootElement(coveo_search_ui_1.InitializationEvents.afterComponentsInitialization, function () {
            var resultListElem = $(_this.root).find(coveo_search_ui_1.Component.computeSelectorForType(coveo_search_ui_1.ResultList.ID));
            _this.resultList = Coveo.get(resultListElem.get(0));
            if (_this.resultList.options.enableInfiniteScroll && _this.resultList.options.infiniteScrollContainer) {
                $(_this.resultList.options.infiniteScrollContainer).scroll(function () {
                    renderThrottle();
                });
            }
        });
        _this.bind.onRootElement(coveo_search_ui_1.ResultListEvents.newResultsDisplayed, function () {
            renderThrottle();
        });
        _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.querySuccess, function (args) {
            _this.totalNumberOfResults = args.results.totalCount;
            _this.render();
        });
        return _this;
    }
    BoxQuerySummary.prototype.render = function () {
        if (this.totalNumberOfResults > 0) {
            if (this.bindings.queryStateModel.get(coveo_search_ui_1.QueryStateModel.attributesEnum.q) == '') {
                this.element.innerHTML = '';
                $(this.element).addClass('coveo-hidden');
            }
            else {
                this.renderWithResults();
                $(this.element).removeClass('coveo-hidden');
            }
        }
        else {
            this.renderNoResults();
            $(this.element).removeClass('coveo-hidden');
        }
    };
    BoxQuerySummary.prototype.renderWithResults = function () {
        var _this = this;
        $(this.element).removeClass('coveo-displaying-no-results');
        var allResults = $(this.resultList.options.resultContainer).find('.CoveoResult');
        var visibleResults = _.filter(allResults, function (resElement) {
            return ($(resElement).position().top + $(resElement).height() * 0.75 > 0 &&
                $(resElement).position().top + $(resElement).height() / 3 < $(_this.resultList.options.infiniteScrollContainer).height());
        });
        if (visibleResults && visibleResults[0]) {
            var first = _.indexOf(allResults, visibleResults[0]) + 1;
            var last = _.indexOf(allResults, visibleResults[visibleResults.length - 1]) + 1;
        }
        if (first != undefined && last != undefined && this.totalNumberOfResults != undefined) {
            $(this.element).html(coveo_search_ui_1.l('ShowingResultsOf', first, last, this.totalNumberOfResults, this.totalNumberOfResults > 1));
        }
    };
    BoxQuerySummary.prototype.renderNoResults = function () {
        $(this.element).addClass('coveo-displaying-no-results');
        var queryEscaped = $('<span></span>')
            .text(this.queryStateModel.get(coveo_search_ui_1.QueryStateModel.attributesEnum.q))
            .text();
        var strToDisplay = $('<div class="coveo-no-results-string"></div>');
        if (queryEscaped != '') {
            strToDisplay = strToDisplay.html(coveo_search_ui_1.l('noResultFor', "<span class='coveo-highlight'>" + queryEscaped + '</span>'));
        }
        else {
            strToDisplay = strToDisplay.html(coveo_search_ui_1.l('No results'));
        }
        strToDisplay.append(this.getSearchTips());
        $(this.element).empty();
        $(this.element).append(strToDisplay);
    };
    BoxQuerySummary.prototype.getSearchTips = function () {
        var searchTips = $('<ul></ul>');
        $('<li></li>')
            .text(coveo_search_ui_1.l('CheckSpelling'))
            .appendTo(searchTips);
        $('<li></li>')
            .text(coveo_search_ui_1.l('TryUsingFewerKeywords'))
            .appendTo(searchTips);
        if (this.queryStateModel.atLeastOneFacetIsActive()) {
            $('<li></li>')
                .text(coveo_search_ui_1.l('SelectFewerFilters'))
                .appendTo(searchTips);
        }
        var element = $(this.root).find(coveo_search_ui_1.Component.computeSelectorForType(BoxHeader_1.BoxHeader.ID));
        var boxHeader = Coveo.get(element.get(0));
        if (boxHeader) {
            if (boxHeader.options.allowNonContextualSearch &&
                !this.bindings.boxStateModel.get(BoxStateModel_1.BoxStateModel.attributesEnum.enableNonContextualSearch)) {
                $('<li></li>')
                    .text('SelectNonContextualSearch'.toLocaleString())
                    .appendTo(searchTips);
            }
        }
        return searchTips;
    };
    BoxQuerySummary.ID = 'BoxQuerySummary';
    BoxQuerySummary.options = {};
    return BoxQuerySummary;
}(coveo_search_ui_1.Component));
exports.BoxQuerySummary = BoxQuerySummary;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxQuerySummary);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var ExtensionBuilder_1 = __webpack_require__(12);
var ExtensionQRF = /** @class */ (function (_super) {
    __extends(ExtensionQRF, _super);
    function ExtensionQRF(element, options, bindings) {
        var _this = _super.call(this, element, ExtensionQRF.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, ExtensionQRF, options);
        if (!_.isUndefined(_this.options.expression)) {
            _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        }
        return _this;
    }
    ExtensionQRF.prototype.handleBuildingQuery = function (args) {
        var expression = new ExtensionBuilder_1.ExtensionBuilder('qrf')
            .withParam('expression', this.options.expression)
            .withParam('normalizeWeight', this.options.normalizeWeight)
            .build();
        args.queryBuilder.advancedExpression.add(expression);
    };
    ExtensionQRF.ID = 'ExtensionQRF';
    ExtensionQRF.options = {
        expression: coveo_search_ui_1.ComponentOptions.buildStringOption(),
        normalizeWeight: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return ExtensionQRF;
}(coveo_search_ui_1.Component));
exports.ExtensionQRF = ExtensionQRF;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(ExtensionQRF);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var ExtensionBuilder_1 = __webpack_require__(12);
var ExtensionQF = /** @class */ (function (_super) {
    __extends(ExtensionQF, _super);
    function ExtensionQF(element, options, bindings) {
        var _this = _super.call(this, element, ExtensionQF.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, ExtensionQF, options);
        if (!_.isUndefined(_this.options.func && !_.isUndefined(_this.options.fieldName))) {
            _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        }
        return _this;
    }
    ExtensionQF.prototype.handleBuildingQuery = function (args) {
        var expression = new ExtensionBuilder_1.ExtensionBuilder('qf')
            .withParam('function', this.options.func)
            .withParam('fieldName', this.options.fieldName)
            .build();
        args.queryBuilder.advancedExpression.add(expression);
    };
    ExtensionQF.ID = 'ExtensionQF';
    ExtensionQF.options = {
        func: coveo_search_ui_1.ComponentOptions.buildStringOption(),
        fieldName: coveo_search_ui_1.ComponentOptions.buildStringOption()
    };
    return ExtensionQF;
}(coveo_search_ui_1.Component));
exports.ExtensionQF = ExtensionQF;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(ExtensionQF);


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var ExtensionRefinedQuery = /** @class */ (function (_super) {
    __extends(ExtensionRefinedQuery, _super);
    function ExtensionRefinedQuery(element, options, bindings) {
        var _this = _super.call(this, element, ExtensionRefinedQuery.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.enabled = true;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, ExtensionRefinedQuery, options);
        _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        return _this;
    }
    ExtensionRefinedQuery.prototype.handleBuildingQuery = function (args) {
        var _this = this;
        if (this.enabled) {
            var expression = _.chain(this.options.include)
                .map(function (include) {
                return _this.bindings.container.options.record[include.toLowerCase()];
            })
                .compact()
                .value()
                .join(' ');
            args.queryBuilder.longQueryExpression.add(expression);
        }
    };
    ExtensionRefinedQuery.prototype.disable = function () {
        this.enabled = false;
        _super.prototype.disable.call(this);
    };
    ExtensionRefinedQuery.prototype.enable = function () {
        this.enabled = true;
        _super.prototype.enable.call(this);
    };
    ExtensionRefinedQuery.ID = 'ExtensionRefinedQuery';
    ExtensionRefinedQuery.options = {
        include: coveo_search_ui_1.ComponentOptions.buildListOption()
    };
    return ExtensionRefinedQuery;
}(coveo_search_ui_1.Component));
exports.ExtensionRefinedQuery = ExtensionRefinedQuery;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(ExtensionRefinedQuery);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var ExtensionSome_1 = __webpack_require__(34);
var ExtensionQRE_1 = __webpack_require__(42);
var BoxRelatedContextImportance;
(function (BoxRelatedContextImportance) {
    BoxRelatedContextImportance[BoxRelatedContextImportance["LOWEST"] = 0] = "LOWEST";
    BoxRelatedContextImportance[BoxRelatedContextImportance["LOW"] = 1] = "LOW";
    BoxRelatedContextImportance[BoxRelatedContextImportance["AVERAGE"] = 2] = "AVERAGE";
    BoxRelatedContextImportance[BoxRelatedContextImportance["HIGH"] = 3] = "HIGH";
    BoxRelatedContextImportance[BoxRelatedContextImportance["HIGHEST"] = 4] = "HIGHEST";
    BoxRelatedContextImportance[BoxRelatedContextImportance["MANDATORY"] = 5] = "MANDATORY";
})(BoxRelatedContextImportance = exports.BoxRelatedContextImportance || (exports.BoxRelatedContextImportance = {}));
var BoxRelatedContext = /** @class */ (function (_super) {
    __extends(BoxRelatedContext, _super);
    function BoxRelatedContext(element, options, bindings) {
        var _this = _super.call(this, element, BoxRelatedContext.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.importanceDescription = [
            {
                importance: BoxRelatedContextImportance.LOWEST,
                modifier: 10,
                match: '10%'
            },
            {
                importance: BoxRelatedContextImportance.LOW,
                modifier: 30,
                match: '30%'
            },
            {
                importance: BoxRelatedContextImportance.AVERAGE,
                modifier: 50,
                match: '50%'
            },
            {
                importance: BoxRelatedContextImportance.HIGH,
                modifier: 70,
                match: '70%'
            },
            {
                importance: BoxRelatedContextImportance.HIGHEST,
                modifier: 100,
                match: '100%'
            },
            {
                importance: BoxRelatedContextImportance.MANDATORY,
                modifier: 100,
                match: '100%'
            }
        ];
        if (bindings.isWaitingForRecord) {
            _this.logger.info('Disabling component : No record found to expand query', _this);
            return _this;
        }
        _this.options.configurations = _.extend({}, options.configurations, BoxRelatedContext.getConfigFromContent(_this.element));
        var expressions = [];
        _.each(_this.options.configurations, function (config) {
            if (config.include) {
                var modifierDescription = _.findWhere(_this.importanceDescription, { importance: config.importance });
                if (!_.isUndefined(modifierDescription)) {
                    // First , get a $some expression with the provided context field
                    // The match parameters depends on the importance of the field configured
                    // This is not added 'directly' to the query, but serves for other part
                    // of the expression
                    var someExpression = new ExtensionSome_1.ExtensionSome(element, {
                        keywords: ExtensionSome_1.ExtensionSome.fromStringArrayToStringKeywords(config.include, bindings),
                        best: BoxRelatedContext.BestKeywordsToMatch,
                        bindOnQuery: false,
                        match: modifierDescription.match
                    }, bindings)
                        .getBuilder()
                        .build();
                    // The first expression we add is a $some paired with @uri if it's not mandatory
                    // (so basically : ($some of the keywords OR anything) if it's not mandatory)
                    var firstExpression;
                    if (modifierDescription.importance != BoxRelatedContextImportance.MANDATORY) {
                        firstExpression = '( ' + someExpression + 'OR @uri )';
                    }
                    else {
                        firstExpression = '( ' + someExpression + ')';
                    }
                    // The second expression is a $qre for $some of the keywords
                    // Will boost document with $some keywords according to the configured importance/modifier
                    var secondExpression = new ExtensionQRE_1.ExtensionQRE(element, {
                        expression: someExpression,
                        modifier: modifierDescription.modifier,
                        bindOnQuery: false,
                        quotedExpression: false
                    }, bindings)
                        .getBuilder()
                        .build();
                    // At the end we get something like :
                    // ($some(keywords, 70%) OR @uri) $qre($some(keywords, 70%)) -> non mandatory context field
                    // ($some(keywords, 70%)) $qre($some(keywords, 70%)) -> mandatory context field with 70% match
                    expressions.push('(' + firstExpression + ' ' + secondExpression + ')');
                }
            }
        });
        if (!_.isEmpty(expressions)) {
            _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.buildingQuery, function (args) {
                _this.handleBuildingQuery(args, expressions.join(' '));
            });
        }
        return _this;
    }
    BoxRelatedContext.getMarkup = function () {
        return $("<script class='CoveoBoxRelatedContext' type='text/x-query-related-object' ></script>");
    };
    BoxRelatedContext.getConfigFromContent = function (content) {
        if (content instanceof HTMLElement) {
            content = content.innerHTML;
        }
        var configFromJson;
        try {
            configFromJson = JSON.parse(content);
        }
        catch (e) {
            configFromJson = [];
        }
        return configFromJson;
    };
    BoxRelatedContext.prototype.handleBuildingQuery = function (args, expression) {
        args.queryBuilder.advancedExpression.add(expression);
    };
    BoxRelatedContext.ID = 'BoxRelatedContext';
    // This number has been chosen after a 5 year PHD thesis analysis
    BoxRelatedContext.BestKeywordsToMatch = 5;
    return BoxRelatedContext;
}(coveo_search_ui_1.Component));
exports.BoxRelatedContext = BoxRelatedContext;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxRelatedContext);


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
/**
 * The _BoxResultAction_ component displays a small actionable button inside each result. When clicked, this button displays other sub components in a menu, such as the `BoxQuickview` Component.
 *
 * **Note:**
 * > For more information on how to implement your own custom actions inside this component, see [Creating Custom Actions for an Insight Panel or a Custom Box](https://developers.coveo.com/x/mAYvAg).
 *
 * This component is intended to be included inside a `BoxBody` [ResultList Component](https://coveo.github.io/search-ui/components/resultlist.html).
 *
 * ```html
 * <div class='CoveoBoxResultAction'>
 *   <!-- Include other components here, such as the BoxQuickView or BoxAttachToCase components -->
 * </div>
 * ```
 */
var BoxResultAction = /** @class */ (function (_super) {
    __extends(BoxResultAction, _super);
    function BoxResultAction(element, options, bindings, result) {
        var _this = _super.call(this, element, BoxResultAction.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxResultAction, options);
        var dotsElement = $('<div></div>')
            .addClass('coveo-box-result-action-icon')
            .html('\u00B7\u00B7\u00B7')
            .appendTo(_this.element);
        _this.menu = $('<div></div>')
            .addClass('coveo-box-result-action-menu')
            .appendTo(_this.element);
        _this.container = $('<div></div>')
            .addClass('coveo-box-result-action-container')
            .appendTo(_this.element);
        if (!_this.options.displayInline) {
            $(_this.element).addClass('coveo-displayed-in-menu');
            var closeTimeout;
            $(_this.element).mouseenter(function () {
                if (closeTimeout) {
                    clearTimeout(closeTimeout);
                }
                _this.menu.addClass('coveo-opened');
            });
            $(_this.element).mouseleave(function () {
                closeTimeout = setTimeout(function () {
                    _this.menu.removeClass('coveo-opened');
                }, _this.options.menuDelay);
            });
        }
        else {
            $(_this.element).addClass('coveo-displayed-inline');
        }
        var replaceElementsOnce = _.once(function () {
            var toMove = [];
            _.each(_this.element.children, function (child) {
                if (_this.doesImplementIncludedInterface(child)) {
                    toMove.push(child);
                }
            });
            if (_.isEmpty(toMove)) {
                _this.logger.warn('BoxResultAction is empty or has no inner elements with which it can populate... removing the component', result, _this);
                $(_this.element).remove();
            }
            else {
                _.each(toMove, function (elem) {
                    var menuItem = $('<div></div>')
                        .addClass('coveo-box-result-action-menu-item')
                        .appendTo(_this.menu);
                    $(Coveo.get(elem)['getTitle'](_this.options.displayInline)).appendTo(menuItem);
                    $(elem).appendTo(_this.container);
                });
            }
        });
        _this.bind.onRootElement(coveo_search_ui_1.ResultListEvents.newResultsDisplayed, function () { return replaceElementsOnce(); });
        return _this;
    }
    BoxResultAction.getMarkup = function () {
        return $("<div class='CoveoBoxResultAction'></div>");
    };
    BoxResultAction.prototype.doesImplementIncludedInterface = function (elem) {
        var elemAsComponent = Coveo.get(elem);
        return elemAsComponent && elemAsComponent['getTitle'];
    };
    BoxResultAction.ID = 'BoxResultAction';
    /**
     * The available options for BoxResultAction
     * @componentOptions
     */
    BoxResultAction.options = {
        /**
         * Specifies the delay, in milliseconds, before the menu disappears when the user's mouse leaves the menu icon.
         *
         * Minimum value is `0`.
         *
         * Default value is `300`.
         *
         * ```html
         * <div class='CoveoBoxResultAction' data-menu-delay='300'></div>
         * ```
         */
        menuDelay: coveo_search_ui_1.ComponentOptions.buildNumberOption({ defaultValue: 300, min: 0 }),
        /**
         * Specifies that components contained inside the `ResultAction` component should instead be displayed inline, and not inside a clickable menu.
         *
         * Setting this option to `true` also displays icons to identify the actions.
         *
         * Default value is `false`.
         *
         * ```html
         * <div class='CoveoBoxResultAction' data-display-inline='false'></div>
         * ```
         */
        displayInline: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return BoxResultAction;
}(coveo_search_ui_1.Component));
exports.BoxResultAction = BoxResultAction;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxResultAction);


/***/ }),
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var AttachToCase_1 = __webpack_require__(20);
/**
 * The _BoxAttachToCase_ component allows you to attach a result to the current Salesforce object. This component normally renders itself inside the {@link BoxResultAction} Component.
 *
 * **Note:**
 * > Your Salesforce users must have `Attached Result` object permissions to be able to use this component (see [Granting Access to Attach to Case Users](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=159)).
 */
var BoxAttachToCase = /** @class */ (function (_super) {
    __extends(BoxAttachToCase, _super);
    function BoxAttachToCase(element, options, bindings, result) {
        var _this = _super.call(this, element, options, bindings, result) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        $(element).removeClass(coveo_search_ui_1.Component.computeCssClassNameForType(AttachToCase_1.AttachToCase.ID));
        return _this;
    }
    BoxAttachToCase.getMarkup = function () {
        return $('<div class="CoveoBoxAttachToCase"></div>');
    };
    BoxAttachToCase.prototype.getTitle = function (displayedInline) {
        this.displayedInline = displayedInline;
        this.renderButton();
        if (this.buttonElement != null) {
            return this.buttonElement.get(0);
        }
    };
    BoxAttachToCase.prototype.renderButton = function () {
        var _this = this;
        $(this.element).empty();
        this.buttonElement = $('<div class="coveo-box-attachToCase-view-in-menu"></div>');
        this.textElement = $('<div class="coveo-caption"></div>').appendTo(this.buttonElement);
        this.iconElement = $('<div class="coveo-icon"></div>').appendTo(this.buttonElement);
        this.buttonElement.click(function () { return _this.handleClick(); });
        this.updateButton();
    };
    BoxAttachToCase.prototype.updateButton = function (sendEvent) {
        if (sendEvent === void 0) { sendEvent = true; }
        this.iconElement.removeClass();
        if (this.loading) {
            this.iconElement.addClass('coveo-icon coveo-attach-to-case-loading');
        }
        else {
            this.iconElement.addClass('coveo-icon coveo-sprites-attach');
        }
        if (this.displayedInline && !this.loading) {
            if (this.isAttached()) {
                this.iconElement.removeClass('coveo-sprites-attach');
                this.iconElement.addClass('coveo-sprites-attached');
            }
            else {
                this.iconElement.removeClass('coveo-sprites-attached');
                this.iconElement.addClass('coveo-sprites-attach');
            }
            this.textElement.empty();
        }
        else if (!this.displayedInline) {
            this.textElement.text(this.isAttached() ? coveo_search_ui_1.l('Detach') : coveo_search_ui_1.l('Attach'));
            this.iconElement.removeClass('coveo-sprites-attach');
            this.iconElement.removeClass('coveo-sprites-attached');
        }
        if (sendEvent) {
            this.sendStateChangedEvent();
        }
    };
    BoxAttachToCase.ID = 'BoxAttachToCase';
    return BoxAttachToCase;
}(AttachToCase_1.AttachToCase));
exports.BoxAttachToCase = BoxAttachToCase;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxAttachToCase);


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
var SalesforceContext_1 = __webpack_require__(15);
var SalesforceUtils_1 = __webpack_require__(7);
/**
 * The _BoxCreateArticle_ component allows the use of the Create Article button in the Coveo Insight Panel (see [Adding a Create Article Button to the Insight Panel](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=243)).
 *
 * Use this component inside the `coveo-box-settings` div.
 *
 * ```html
 * <div class="coveo-box-settings">
 *     <a class="CoveoBoxCreateArticle" target="_blank">
 *     </a>
 *     ...
 * </div>
 * ```
 */
var BoxCreateArticle = /** @class */ (function (_super) {
    __extends(BoxCreateArticle, _super);
    function BoxCreateArticle(element, options, bindings) {
        var _this = _super.call(this, element, BoxCreateArticle.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.createArticlePage = '/knowledge/publishing/articleEdit.apexp';
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxCreateArticle, options);
        if (bindings.isWaitingForRecord) {
            _this.logger.info('Disabling component : No record found', _this);
            $(_this.element).remove();
            return _this;
        }
        if (SalesforceContext_1.getSalesforceContext().knowledgeArticleInfos.isKnowledgeEnabled) {
            if (_this.options.articleTypeFilter.length == 0)
                _this.articleTypes = SalesforceContext_1.getSalesforceContext().knowledgeArticleInfos.types;
            else
                _this.articleTypes = SalesforceContext_1.getSalesforceContext().knowledgeArticleInfos.types.filter(function (type) {
                    return _.contains(_this.options.articleTypeFilter, type.type);
                });
            _this.renderElement();
        }
        else {
            $(_this.element).remove();
        }
        return _this;
    }
    BoxCreateArticle.prototype.bindAction = function (element, articleType) {
        var _this = this;
        this.bindAnalyticsEvent(element);
        if (SalesforceUtils_1.SalesforceUtilities.isInSalesforceConsole()) {
            element.click(function (e) {
                e.preventDefault();
                SalesforceUtils_1.SalesforceUtilities.focusOrOpenTab(_this.buildHref(articleType), coveo_search_ui_1.l('BoxCreateArticle'), _this.options.openInPrimaryTab);
            });
        }
    };
    BoxCreateArticle.prototype.bindAnalyticsEvent = function (element) {
        var _this = this;
        element.click(function () {
            _this.bindings.usageAnalytics.logCustomEvent({ name: 'createArticle', type: 'box' }, {}, _this.element);
        });
    };
    BoxCreateArticle.prototype.renderElement = function () {
        var _this = this;
        var title = $('<span>')
            .text(coveo_search_ui_1.l('BoxCreateArticle'))
            .appendTo(this.element);
        var icon = $('<span class="coveo-icon coveo-sprites-checkbox-more-values"></span>').appendTo(this.element);
        if (this.articleTypes.length == 0) {
            $(this.element).addClass('coveo-box-create-article-disabled');
            $(this.element).click(function (e) {
                e.preventDefault();
                _this.logger.error('No ArticleTypes provided');
            });
            return;
        }
        if (this.articleTypes.length == 1) {
            $(this.element).attr('href', this.buildHref(this.articleTypes[0].type));
            this.bindAction($(this.element), this.articleTypes[0].type);
        }
        else {
            var container = $('<div class="coveo-box-create-article-container"></div>').appendTo(this.element);
            var closeTimeout;
            $(this.element).mouseenter(function () {
                if (closeTimeout) {
                    clearTimeout(closeTimeout);
                }
                container.addClass('coveo-box-create-article-container-open');
            });
            $(this.element).mouseleave(function () {
                closeTimeout = setTimeout(function () {
                    container.removeClass('coveo-box-create-article-container-open');
                }, 100);
            });
            _.each(this.articleTypes, function (articleType, key) {
                var el = $('<a class="coveo-box-create-article-container-link" target="_blank">')
                    .text(articleType.label)
                    .attr('href', _this.buildHref(articleType.type))
                    .appendTo(container);
                _this.bindAction(el, articleType.type);
            });
            var leftValue = ($(this.element).width() + 5 - container.width()) / 2;
            container.css('left', leftValue);
        }
        if (this.options.hidden) {
            $(this.element).addClass('coveo-hidden');
        }
    };
    BoxCreateArticle.prototype.buildHref = function (articleType) {
        return (this.createArticlePage +
            '?retURL=' +
            SalesforceContext_1.getSalesforceContext().record.id +
            '&sourceId=' +
            SalesforceContext_1.getSalesforceContext().record.id +
            '&sfdc.override=1&type=' +
            articleType);
    };
    /**
     * Changes the page to redirect to when selecting the create article button.
     *
     * By default, the component redirects to `/knowledge/publishing/articleEdit.apexp`.
     *
     * @param page The redirect page URL­.
     *
     * ```js
     * $('.CoveoBoxCreateArticle').coveo('setCreateArticlePage', '/knowledge/publishing/articleEdit.apexp')
     * ```
     */
    BoxCreateArticle.prototype.setCreateArticlePage = function (page) {
        this.createArticlePage = page;
    };
    BoxCreateArticle.ID = 'BoxCreateArticle';
    /**
     * The possible options for BoxCreateArticle
     * @componentOptions
     */
    BoxCreateArticle.options = {
        /**
         * Specifies the Knowledge Article types to offer as options when creating an article.
         *
         * By default, all the available Knowledge Article types are displayed.
         *
         * ```html
         * <a class="CoveoBoxCreateArticle" data-article-type-filter="knowledge__kav,troubleshooting__kav"></a>
         * ```
         */
        articleTypeFilter: coveo_search_ui_1.ComponentOptions.buildListOption({ defaultValue: [] }),
        /**
         * Specifies if the component should be hidden from the display.
         *
         * Default value is `true`.
         *
         * ```html
         * <a class="CoveoBoxCreateArticle" data-hidden="true"></a>
         * ```
         */
        hidden: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Whether to open the created article in a primary tab or, when set to false, to open it in a sub tab.
         *
         * Default value is `true`.
         *
         * ```html
         * <a class="CoveoBoxCreateArticle" data-open-in-primary-tab="false"></a>
         * ```
         */
        openInPrimaryTab: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return BoxCreateArticle;
}(coveo_search_ui_1.Component));
exports.BoxCreateArticle = BoxCreateArticle;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxCreateArticle);


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
/**
 * @deprecated The _BoxPipelineContext_ component is deprecated. Instead, use the [Coveo PipelineContext Component](https://coveo.github.io/search-ui/components/pipelinecontext.html).
 */
var BoxPipelineContext = /** @class */ (function (_super) {
    __extends(BoxPipelineContext, _super);
    function BoxPipelineContext(element, options, bindings) {
        var _this = _super.call(this, element, BoxPipelineContext.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        return _this;
    }
    BoxPipelineContext.getMarkup = function () {
        return $("<script class='CoveoBoxPipelineContext' type='text/x-context'>{}</script>");
    };
    BoxPipelineContext.ID = 'BoxPipelineContext';
    return BoxPipelineContext;
}(coveo_search_ui_1.PipelineContext));
exports.BoxPipelineContext = BoxPipelineContext;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxPipelineContext);


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
var BoxHeader_1 = __webpack_require__(50);
/**
 * The _BoxPopup_ component is only a container inside of which you can drop any other content or component.
 *
 * Since the {@link Box} component is designed to be included in the Salesforce console sidebar with a limited amount of space, it might be useful to add section that can be hidden or shown when the user clicks on them.
 *
 * The HTML content inside the `BoxPopup` div is used to determine what is shown or hidden when the panel is opened and closed.
 *
 * ```html
 * <div class='CoveoBoxPopup'>
 *   <div class='coveo-facet-column'>
 *     <div class='CoveoFacet' data-field='@myfirstfacet'></div>
 *     <div class='CoveoFacet' data-field='@mysecondfacet'></div>
 *     <div class='CoveoFacet' data-field='@mythirdfacet'></div>
 *   </div>
 * </div>
 * ```
 */
var BoxPopup = /** @class */ (function (_super) {
    __extends(BoxPopup, _super);
    function BoxPopup(element, options, bindings, id) {
        if (id === void 0) { id = BoxPopup.ID; }
        var _this = _super.call(this, element, id, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.id = id;
        _this.isOpen = false;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxPopup, options);
        _this.popupWrapper = $('<div></div>')
            .addClass('coveo-box-popup-wrapper')
            .appendTo(_this.element);
        $(_this.element)
            .children()
            .appendTo(_this.popupWrapper);
        _this.buildToggleButton();
        _this.close();
        if (_this.options.hidden) {
            _this.toggleButton.addClass('coveo-hidden');
        }
        $(_this.root).on('click', function (e) {
            if (!_this.disabled && e.target != _this.element && $(_this.element).find($(e.target)).length == 0) {
                _this.close();
            }
        });
        _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.querySuccess, function () {
            _this.setTopPosition();
            _this.setToggleHeight();
            _this.setToggleWidth();
        });
        return _this;
    }
    BoxPopup.getMarkup = function () {
        return $("<div class='CoveoBoxPopup'></div>");
    };
    /**
     * Sets the title displayed in the popup container.
     *
     * @param title The title to display
     *
     * ```js
     * $('.CoveoBoxPopup').coveo('setTitle', 'Your New Title');
     * ```
     */
    BoxPopup.prototype.setTitle = function (title) {
        this.logger.trace('Setting title', title);
        var toSet = $('<span></span>');
        if (_.isString(title)) {
            toSet.text(title);
        }
        else {
            toSet.append($(title));
        }
        this.buildTitle(toSet);
    };
    BoxPopup.prototype.getTopPosition = function () {
        var header = $(this.root).find('.' + coveo_search_ui_1.Component.computeCssClassNameForType(BoxHeader_1.BoxHeader.ID));
        if (header.length != 0) {
            this.top = header.position().top + header.outerHeight();
        }
        else {
            this.top = 0;
        }
        return this.top;
    };
    BoxPopup.prototype.setTopPosition = function () {
        this.top = this.getTopPosition();
    };
    BoxPopup.prototype.setToggleHeight = function () {
        if (this.options.fullHeight) {
            this.popupWrapper.css({
                bottom: 0,
                top: $(this.element).offset().top + $(this.element).outerHeight() - 5,
                position: 'fixed',
                height: 'auto',
                'max-height': 'inherit'
            });
        }
        else {
            this.popupWrapper.css({
                top: $(this.element).offset().top + $(this.element).outerHeight() - 5,
                position: 'fixed'
            });
        }
    };
    BoxPopup.prototype.setToggleWidth = function () {
        if (this.options.fullWidth) {
            this.popupWrapper.css({
                right: 0,
                left: 0,
                position: 'fixed',
                width: 'auto',
                'max-width': 'inherit'
            });
        }
    };
    /**
     * Opens the popup.
     *
     * ```js
     * $('.CoveoBoxPopup').coveo('open');
     * ```
     */
    BoxPopup.prototype.open = function () {
        this.setTopPosition();
        this.setToggleWidth();
        this.setToggleHeight();
        $(this.element).trigger('onPopupOpen');
        this.logger.trace('Opening popup');
        this.isOpen = true;
        if (this.top == undefined) {
            this.setTopPosition();
        }
        this.setClasses();
        $(window).trigger('resize');
    };
    /**
     * Closes the popup.
     *
     * ```js
     * $('.CoveoBoxPopup').coveo('close');
     * ```
     */
    BoxPopup.prototype.close = function () {
        this.logger.trace('Closing popup');
        this.isOpen = false;
        this.setClasses();
    };
    /**
     * Opens or closse the popup depending on its current state.
     *
     * ```js
     * $('.CoveoBoxPopup').coveo('toggle');
     * ```
     */
    BoxPopup.prototype.toggle = function () {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.open();
        }
        else {
            this.close();
        }
    };
    BoxPopup.prototype.setClasses = function () {
        $(this.element).toggleClass('coveo-opened', this.isOpen);
        if (this.options.withAnimation) {
            $(this.element).addClass('coveo-with-animation');
        }
    };
    BoxPopup.prototype.buildTitle = function (title) {
        if (title === void 0) { title = this.buildBasicTitle(); }
        if (this.titleElement) {
            this.titleElement.remove();
        }
        this.titleElement = title.addClass('coveo-box-popup-title').appendTo(this.toggleButton);
    };
    BoxPopup.prototype.buildBasicTitle = function () {
        var element = $('<span></span>');
        var title = $('<span></span>')
            .text(this.options.title)
            .appendTo(element);
        if (this.options.icon !== undefined && this.options.icon != '') {
            $('<span></span>')
                .addClass('coveo-icon')
                .addClass(this.options.icon)
                .prependTo(element);
        }
        return element;
    };
    BoxPopup.prototype.buildToggleButton = function () {
        var _this = this;
        this.toggleButton = $('<div class="coveo-box-popup-toggle"></div>');
        this.buildTitle();
        $(this.element).prepend(this.toggleButton);
        this.toggleButton.click(function () { return _this.toggle(); });
    };
    BoxPopup.ID = 'BoxPopup';
    /**
     * The possible options for BoxPopup
     * @componentOptions
     */
    BoxPopup.options = {
        /**
         * Specifies the static title to display.
         *
         * Default value is `Click here to open`.
         *
         * **Note:**
         * > Since this component exposes methods to set its title, it is possible that other components contained inside this container dynamically set it.
         *
         * ```html
         * <div data-title='Click here to open'></div>
         * ```
         */
        title: coveo_search_ui_1.ComponentOptions.buildStringOption({ defaultValue: 'Click here to open' }),
        /**
         * Specifies the CSS class used for your icon.
         *
         * ```html
         * <div data-icon='custom-icon-class'></div>
         * ```
         */
        icon: coveo_search_ui_1.ComponentOptions.buildIconOption(),
        /**
         * Specifies if the popup should open with an animation.
         *
         * The animation is completely CSS based. To modify the animation itself, modify the CSS rules that apply to the relevant elements.
         *
         * Default value is `true`.
         *
         * ```html
         * <div data-with-animation='true'></div>
         * ```
         */
        withAnimation: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies if the popup should open with the fully available width of the page.
         *
         * Default value is `false`.
         *
         * ```html
         * <div data-full-width='false'></div>
         * ```
         */
        fullWidth: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies if the popup should open with the fully available height of the page.
         *
         * Default value is `false`.
         *
         * ```html
         * <div data-full-height='false'></div>
         * ```
         */
        fullHeight: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether the component should be hidden.
         *
         * Defaut value is `false`.
         *
         * ```html
         * <div data-hidden='false'></div>
         * ```
         */
        hidden: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return BoxPopup;
}(coveo_search_ui_1.Component));
exports.BoxPopup = BoxPopup;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxPopup);


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var SalesforceUtils_1 = __webpack_require__(7);
var SalesforceContext_1 = __webpack_require__(15);
var BoxStateModel_1 = __webpack_require__(16);
var BoxQueryGeneric = /** @class */ (function (_super) {
    __extends(BoxQueryGeneric, _super);
    function BoxQueryGeneric(element, options, bindings) {
        var _this = _super.call(this, element, BoxQueryGeneric.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.isDisabledFromContextualQuery = false;
        if (bindings.isWaitingForRecord) {
            _this.logger.info('Disabling component : No record found to expand query', _this);
            return _this;
        }
        if ($(_this.element).is('script')) {
            _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxQueryGeneric, options);
            try {
                _this.content = coveo_search_ui_1.Utils.decodeHTMLEntities($(_this.element).text());
            }
            catch (e) {
                return _this;
            }
            if (!_.isUndefined(_this.content) && _this.content != '') {
                _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
            }
        }
        if (_this.options.disableOnNonContextualSearch) {
            $(_this.root).on(_this.bindings.boxStateModel.getSimpleEvent(BoxStateModel_1.BoxStateModel.attributesEnum.enableNonContextualSearch), function (e, args) {
                _this.isDisabledFromContextualQuery = args.value;
            });
        }
        return _this;
    }
    BoxQueryGeneric.getMarkup = function () {
        return $("<script class='CoveoBoxQueryGeneric' type='text/x-query-generic'></script>");
    };
    BoxQueryGeneric.prototype.handleBuildingQuery = function (args) {
        if (!this.isDisabledFromContextualQuery) {
            var query = SalesforceUtils_1.SalesforceUtilities.expandStringUsingRecord(this.content, SalesforceContext_1.getSalesforceContext().record);
            if (!coveo_search_ui_1.Utils.isEmptyString(query)) {
                args.queryBuilder.advancedExpression.add(query);
            }
        }
    };
    BoxQueryGeneric.ID = 'BoxQueryGeneric';
    BoxQueryGeneric.options = {
        disableOnNonContextualSearch: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return BoxQueryGeneric;
}(coveo_search_ui_1.Component));
exports.BoxQueryGeneric = BoxQueryGeneric;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxQueryGeneric);


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
var ExtensionSome_1 = __webpack_require__(34);
var ExtensionRefinedQuery_1 = __webpack_require__(57);
var BoxStateModel_1 = __webpack_require__(16);
var SalesforceContext_1 = __webpack_require__(15);
/**
 * The _BoxQuerySome_ component is used to automatically include Salesforce fields to the query of an Insight Panel.
 * By default, the fields are included in the advanced query (see [Advanced Expression](https://developers.coveo.com/x/P4CpAQ#ProfilingaQuery-AdvancedExpression)).
 *
 * This component is included in the default Insight Panel to include the case subject.
 *
 * ```html
 * <div class="CoveoBoxQuerySome"></div>
 * ```
 */
var BoxQuerySome = /** @class */ (function (_super) {
    __extends(BoxQuerySome, _super);
    function BoxQuerySome(element, options, bindings) {
        var _this = _super.call(this, element, BoxQuerySome.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.isDisabledFromContextualQuery = false;
        if (bindings.isWaitingForRecord) {
            _this.logger.info('Disabling component : No record found to expand query', _this);
            return _this;
        }
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxQuerySome, options);
        if (!_.isUndefined(_this.options.include) && !_.isEmpty(_this.options.include)) {
            _this.fromIncludeOptionToKeywords();
        }
        if (!_.isUndefined(_this.keywordsForQuery) && !_.isEmpty(_this.keywordsForQuery)) {
            var elementForExtension = $('<div />');
            if (_this.options.useSomeQRE) {
                _this.extensionQuery = new ExtensionSome_1.ExtensionSome(elementForExtension.get(0), _.extend({}, { keywords: _this.keywordsForQuery }, _this.options), bindings);
            }
            else {
                _this.extensionQuery = new ExtensionRefinedQuery_1.ExtensionRefinedQuery(elementForExtension.get(0), { include: _this.options.include }, _this.bindings);
            }
        }
        if (!_this.options.includeCurrentRecord) {
            _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.buildingQuery, function (args) {
                if (!_this.isDisabledFromContextualQuery) {
                    args.queryBuilder.advancedExpression.addFieldNotEqualExpression('@sfid', [SalesforceContext_1.getSalesforceContext().record.id]);
                }
            });
        }
        if (_this.options.disableOnNonContextualSearch) {
            $(_this.root).on(_this.bindings.boxStateModel.getSimpleEvent(BoxStateModel_1.BoxStateModel.attributesEnum.enableNonContextualSearch), function (e, args) {
                _this.isDisabledFromContextualQuery = args.value;
                if (_this.extensionQuery) {
                    if (args.value) {
                        _this.extensionQuery.disable();
                    }
                    else if (!_this.disabled) {
                        _this.extensionQuery.enable();
                    }
                }
            });
        }
        return _this;
    }
    /**
     * Enables the component.
     *
     * ```js
     * $('.CoveoBoxQuerySome').coveo('enable');
     * ```
     */
    BoxQuerySome.prototype.enable = function () {
        if (!this.isDisabledFromContextualQuery) {
            if (this.extensionQuery) {
                this.extensionQuery.enable();
            }
        }
        _super.prototype.enable.call(this);
    };
    /**
     * Disables the component.
     *
     * ```js
     * $('.CoveoBoxQuerySome').coveo('disable');
     * ```
     */
    BoxQuerySome.prototype.disable = function () {
        if (this.extensionQuery) {
            this.extensionQuery.disable();
        }
        _super.prototype.disable.call(this);
    };
    BoxQuerySome.prototype.fromIncludeOptionToKeywords = function () {
        this.keywordsForQuery = ExtensionSome_1.ExtensionSome.fromStringArrayToStringKeywords(this.options.include, this.bindings);
    };
    BoxQuerySome.ID = 'BoxQuerySome';
    // This doc is static because doing it the other way prevents the components from showing up in the documentation, or breaks TypeDoc.
    // This is most likely due to the _.omit
    /**
     * @componentOptions
     *
     * <br />
     * <br />
     * ### include
     *
     * ---
     *
     * include: _string_
     *
     * ---
     *
     * A comma separated list of fields to automatically add to the query.
     *
     * Default value is `Subject`.
     *
     * ```html
     * <div data-include="Subject"></div>
     * ```
     * <br />
     * ### includeCurrentRecords
     *
     * ---
     *
     * includeCurrentRecords: _boolean_
     *
     * ---
     *
     * Specifies whether to include the currently viewed case in the search results.
     *
     * Default value is `false`.
     *
     * ```html
     * <div data-include-current-record="false"></div>
     * ```
     * <br />
     * ### disableOnNonContextualSearch
     *
     * ---
     *
     * disableOnNonContextualSearch: _boolean_
     *
     * ---
     *
     * Specifies whether to disable the added query from the `include` option when a user decides to perform a non-contextual search.
     *
     * Default value is `true`.
     *
     * ```html
     * <div data-disable-on-non-contextual-search="true"></div>
     * ```
     * <br />
     * ### useSomeQRE
     *
     * ---
     *
     * useSomeQRE: _boolean_
     *
     * ---
     *
     * Specifies whether to generate the query using the `$some` query extension (see [Standard Query Extensions - $some](https://developers.coveo.com/x/ZQMv#StandardQueryExtensions-$some)).
     *
     * Setting this option to `false` changes the query from an `aq` to a long query (see [Long Expression](https://developers.coveo.com/x/P4CpAQ#ProfilingaQuery-LongExpression)), enabling Coveo Machine Learning Intelligent Term Detection (ITD).
     *
     * Default value is `true`.
     *
     * ```html
     * <div data-use-some-q-r-e="true"></div>
     * ```
     */
    BoxQuerySome.options = _.extend({}, {
        include: coveo_search_ui_1.ComponentOptions.buildListOption(),
        includeCurrentRecord: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        disableOnNonContextualSearch: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        useSomeQRE: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    }, _.omit(ExtensionSome_1.ExtensionSome.options, ['keywords', 'maximum']));
    return BoxQuerySome;
}(coveo_search_ui_1.Component));
exports.BoxQuerySome = BoxQuerySome;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxQuerySome);


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
/**
 * The _BoxQuickview_ component inherits from the Quickview component, and thus provides all the same options(see [Coveo Component Quickview](https://coveo.github.io/search-ui/components/quickview.html)).
 *
 * ```html
 * <div class='CoveoBoxQuickView'></div>
 * ```
 */
var BoxQuickview = /** @class */ (function (_super) {
    __extends(BoxQuickview, _super);
    function BoxQuickview(element, options, bindings, result) {
        var _this = _super.call(this, element, options, bindings, result) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        $(element).removeClass(coveo_search_ui_1.Component.computeCssClassNameForType(coveo_search_ui_1.Quickview.ID));
        if (!coveo_search_ui_1.QueryUtils.hasHTMLVersion(result)) {
            _this.logger.warn('Result has no html version... removing Quickview', result, _this);
            $(_this.element).remove();
        }
        return _this;
    }
    BoxQuickview.getMarkup = function () {
        return $('<div class="CoveoBoxQuickview"></div>');
    };
    BoxQuickview.prototype.getTitle = function (displayedInline) {
        var _this = this;
        var menuDiv;
        if (displayedInline) {
            menuDiv = $('<div title="Quickview" class="coveo-box-quick-view-in-menu"><div class="coveo-icon coveo-sprites-quickview"></div></div>');
        }
        else {
            menuDiv = $('<div title="Quickview" class="coveo-box-quick-view-in-menu"><div class="coveo-caption">' + coveo_search_ui_1.l('Quickview') + '</div></div>');
        }
        menuDiv.click(function () {
            _this.open();
        });
        return menuDiv.get(0);
    };
    BoxQuickview.ID = 'BoxQuickview';
    return BoxQuickview;
}(coveo_search_ui_1.Quickview));
exports.BoxQuickview = BoxQuickview;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxQuickview);


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(2);
var coveo_search_ui_1 = __webpack_require__(0);
/**
 * The _BoxBody_ component takes care of appending a [ResultList Component](https://coveo.github.io/search-ui/components/resultlist.html) and ensuring the correct CSS styles are applied so that infinite scrolling works properly.
 *
 * By default, the _ResultList_ component is initialized with the following option:
 *
 * ```
 * enableInfiniteScroll: true;
 * ```
 *
 * When you wish to modify other options on the _ResultList_ component, when initializing the framework, add the following code.
 *
 * Remember to change `#MyBox` with the id of your `CoveoBoxBody` component, and `20` with the page size you wish to modify.
 *
 * ```js
 * $('#MyBox').coveo('initBox', {
 *     BoxBody : {
 *         infiniteScrollPageSize : 20
 *     }
 * })
 * ```
 *
 * Use this component on your page this way:
 *
 * ```html
 * <div class='CoveoBoxBody'></div>
 * ```
 */
var BoxBody = /** @class */ (function (_super) {
    __extends(BoxBody, _super);
    function BoxBody(element, options, bindings) {
        var _this = _super.call(this, element, BoxBody.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxBody, options);
        _this.appendResultList();
        // To get a simple to use scrollable result list, we need
        // to set a max height on the body whenever a query arrives.
        // This is because there can be elements in the page that appear or dissapear depending on what the query returns
        // eg: Did you mean, error report, or any custom components
        _this.bind.onRootElement(coveo_search_ui_1.QueryEvents.deferredQuerySuccess, function () { return _this.resize(); });
        _this.resizeHandler = function () { return _this.resize(); };
        $(window).resize(_this.resizeHandler);
        _this.bind.onRootElement(coveo_search_ui_1.InitializationEvents.nuke, _this.handleNuke);
        _this.resize();
        return _this;
    }
    BoxBody.getMarkup = function () {
        return $("<div class='CoveoBoxBody'></div>");
    };
    /**
     * Returns the height of the component. It is used mostly for the `resize` method.
     *
     * ```js
     * $('#myBoxBody').coveo('getHeight')
     * ```
     */
    BoxBody.prototype.getHeight = function () {
        var _this = this;
        var otherHeight = _.chain($(this.root).children())
            .reject(function (elem) {
            return $(elem).get(0) == $(_this.element).get(0);
        })
            .reduce(function (memo, elem) {
            if ($(elem).css('display') == 'none') {
                return memo + 0;
            }
            else {
                return memo + $(elem).outerHeight();
            }
        }, 0)
            .value();
        return otherHeight;
    };
    /**
     * Calculates the current required height for the body so that infinite scrolling works correctly.
     *
     * It is called once when the component is first initialized and after every query, but you might need to call it again if you have something in your box that changes the header or footer height.
     *
     * ```js
     * $('#myBoxBody').coveo('resize')
     * ```
     */
    BoxBody.prototype.resize = function () {
        $(this.element).height($(window).height() - parseInt(this.getHeight().toString()));
    };
    BoxBody.prototype.appendResultList = function () {
        var resultListDiv = $('<div></div>').addClass(coveo_search_ui_1.Component.computeCssClassNameForType(coveo_search_ui_1.ResultList.ID));
        $(this.element).append(resultListDiv);
        var resultListOptions = _.extend({}, this.bindings.container.options.originalOptionsObject.ResultList, this.options);
        if (resultListOptions == undefined) {
            resultListOptions = {};
        }
        if (resultListOptions.enableInfiniteScroll == undefined) {
            resultListOptions.enableInfiniteScroll = true;
        }
        new coveo_search_ui_1.ResultList(resultListDiv.get(0), resultListOptions, this.bindings);
    };
    BoxBody.prototype.handleNuke = function () {
        $(window).off('resize', this.resizeHandler);
    };
    BoxBody.ID = 'BoxBody';
    /**
     * The possible options for boxBody
     * @componentOptions
     */
    BoxBody.options = {
        /**
         * Specifies whether the component should automatically load more results when the user has reached the bottom of the result list.
         *
         * Default value is `true`.
         *
         * ```html
         * <div class="CoveoBoxBody" data-enable-infinite-scroll="true"></div>
         * ```
         */
        enableInfiniteScroll: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies the element inside which to insert the rendered result templates.
         *
         * Performing a new query clears the content of this element.
         *
         * You can change the container by specifying its selector (e.g.,
         * `data-result-container-selector='#someCssSelector'`).
         *
         * If you do not specify a value for this option, a `div` element will be dynamically created and appended to the result
         * list. This element will then be used as a result container.
         *
         * ```html
         * <div class="CoveoBoxBody" data-result-container="myElement"></div>
         * ```
         */
        resultContainer: coveo_search_ui_1.ResultList.options.resultContainer,
        resultTemplate: coveo_search_ui_1.ResultList.options.resultTemplate,
        /**
         * Specifies the type of animation to display while waiting for a query to return.
         *
         * The possible values are:
         * - `fade`: Fades out the current list of results while the query is executing.
         * - `spinner`: Shows a spinning animation while the query is executing.
         * - `none`: Use no animation during queries.
         *
         * See also the [`waitAnimationContainer`]{@link BoxBody.options.waitAnimationContainer} option.
         *
         * Default value is `none`.
         *
         * ```html
         * <div class="CoveoBoxBody" data-wait-animation="none"></div>
         * ```
         */
        waitAnimation: coveo_search_ui_1.ResultList.options.waitAnimation,
        /**
         * Specifies the element inside which to display the [`waitAnimation`]{@link BoxBody.options.waitAnimation}.
         *
         * You can change this by specifying a CSS selector (e.g.,
         * `data-wait-animation-container-selector='#someCssSelector'`).
         *
         * Default value is the value of the [`resultContainer`]{@link BoxBody.options.resultContainer} option.
         *
         ```html
         * <div class="CoveoBoxBody" data-wait-animation-container="myElement"></div>
         * ```
         */
        waitAnimationContainer: coveo_search_ui_1.ResultList.options.waitAnimationContainer,
        /**
         * If the [`enableInfiniteScroll`]{@link BoxBody.options.enableInfiniteScroll} option is `true`, specifies the
         * number of additional results to fetch when the user scrolls down to the bottom of the
         * [`infiniteScrollContainer`]{@link BoxBody.options.infiniteScrollContainer}.
         *
         * Default value is `10`. Minimum value is `1`.
         *
         * ```html
         * <div class="CoveoBoxBody" data-infinite-scroll-page-size="10"></div>
         * ```
         */
        infiniteScrollPageSize: coveo_search_ui_1.ResultList.options.infiniteScrollPageSize,
        /**
         * When the [`enableInfiniteScroll`]{@link BoxBody.options.enableInfiniteScroll} option is `true`, specifies the
         * element that triggers fetching additional results when the end user scrolls down to its bottom.
         *
         * You can change the container by specifying its selector (e.g.,
         * `data-infinite-scroll-container-selector='#someCssSelector'`).
         *
         * By default, the framework uses the first vertically scrollable parent element it finds, starting from the
         * `ResultList` element itself. A vertically scrollable element is an element whose CSS `overflow-y` attribute is
         * `scroll`.
         *
         * This implies that if the framework cannot find a scrollable parent, it uses the `window` itself as a scrollable
         * container.
         *
         * This heuristic is not perfect, for technical reasons. There are always some corner case CSS combination which the
         * framework will not be able to correctly detect as 'scrollable'.
         *
         * It is highly recommended that you manually set this option if you wish something else than the `window` to be the
         * scrollable element.
         *
         * ```html
         * <div class="CoveoBoxBody" data-infinite-scroll-container="myElement"></div>
         * ```
         */
        infiniteScrollContainer: coveo_search_ui_1.ResultList.options.infiniteScrollContainer,
        /**
         * When the [`enableInfiniteScroll`]{@link BoxBody.options.enableInfiniteScroll} option is `true`, specifies
         * whether to display the [`waitingAnimation`]{@link BoxBody.options.waitAnimation} while fetching additional
         * results.
         *
         * Default value is `true`.
         *
         * ```html
         * <div class="CoveoBoxBody" data-enable-infinite-scroll-waiting-animation="true"></div>
         * ```
         */
        enableInfiniteScrollWaitingAnimation: coveo_search_ui_1.ResultList.options.enableInfiniteScrollWaitingAnimation,
        mobileScrollContainer: coveo_search_ui_1.ResultList.options.mobileScrollContainer,
        /**
         * Specifies whether the `ResultList` should scan its result templates to discover which fields it must request to
         * be able to render all results.
         *
         * Setting this option to `true` ensures that the Coveo Search API does not return fields that are unnecessary for
         * the UI to function.
         *
         * Default value is `false`, which means that for each result, the Coveo Search API returns all available fields
         * (unless you specify a list of values in the [`fieldsToInclude`]{@link BoxBody.options.fieldsToInclude} option,
         * in which case the Coveo Search API only returns those fields, if they are available).
         *
         * **Note:**
         * > Many interfaces created with the JavaScript Search Interface Editor explicitly set this option to `true`.
         *
         * ```html
         * <div class="CoveoBoxBody" data-auto-select-fields-to-include="true"></div>
         * ```
         */
        autoSelectFieldsToInclude: coveo_search_ui_1.ResultList.options.autoSelectFieldsToInclude,
        /**
         * Specifies a list of fields to include in the query results.
         *
         * If you set the [`autoSelectFieldsToInclude`]{@link BoxBody.options.autoSelectFieldsToInclude} option to
         * `true`, the Coveo Search API returns the fields you specify for this option (if those fields are available) in
         * addition to the fields which the `ResultList` automatically requests.
         *
         * Otherwise, the Coveo Search API only returns the fields you specify for this option (if those fields are
         * available), unless you leave this option undefined, in which case the Coveo Search API returns all available
         * fields.
         *
         * ```html
         * <div class="CoveoBoxBody" data-fields-to-include="@myFirstField,@mySecondField,@myNthField"></div>
         * ```
         */
        fieldsToInclude: coveo_search_ui_1.ResultList.options.fieldsToInclude
    };
    return BoxBody;
}(coveo_search_ui_1.Component));
exports.BoxBody = BoxBody;
// The options are extended here to ensure TypeDoc builds the documentation properly.
BoxBody.options = _.extend({}, BoxBody.options);
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxBody);


/***/ }),
/* 98 */,
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Box_1 = __webpack_require__(47);
var coveo_search_ui_1 = __webpack_require__(0);
// Components
__export(__webpack_require__(8));
__export(__webpack_require__(100));
__export(__webpack_require__(31));
__export(__webpack_require__(20));
__export(__webpack_require__(90));
// Box Related Stuff
__export(__webpack_require__(47));
__export(__webpack_require__(91));
__export(__webpack_require__(48));
__export(__webpack_require__(49));
__export(__webpack_require__(53));
__export(__webpack_require__(101));
__export(__webpack_require__(92));
__export(__webpack_require__(93));
__export(__webpack_require__(51));
__export(__webpack_require__(94));
__export(__webpack_require__(95));
__export(__webpack_require__(54));
__export(__webpack_require__(96));
__export(__webpack_require__(58));
__export(__webpack_require__(59));
__export(__webpack_require__(102));
__export(__webpack_require__(103));
__export(__webpack_require__(16));
__export(__webpack_require__(97));
__export(__webpack_require__(52));
__export(__webpack_require__(104));
__export(__webpack_require__(12));
__export(__webpack_require__(56));
__export(__webpack_require__(42));
__export(__webpack_require__(55));
__export(__webpack_require__(57));
__export(__webpack_require__(34));
__export(__webpack_require__(15));
function initBoxInterface(element, options, type, injectMarkup) {
    if (options === void 0) { options = {}; }
    if (type === void 0) { type = 'Standard'; }
    if (injectMarkup === void 0) { injectMarkup = true; }
    options = coveo_search_ui_1.Initialization.resolveDefaultOptions(element, options);
    var box = new Box_1.Box(element, options.Box, options.Analytics, options);
    box.options.originalOptionsObject = options;
    var initParameters = { options: options, bindings: box.getBindings() };
    return coveo_search_ui_1.Initialization.automaticallyCreateComponentsInside(element, initParameters);
}
exports.initBoxInterface = initBoxInterface;
coveo_search_ui_1.Initialization.registerNamedMethod('initInsightPanel', function (element, options) {
    if (options === void 0) { options = {}; }
    coveo_search_ui_1.Initialization.initializeFramework(element, options, function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return initBoxInterface(element, options);
    });
});
// Load strings
var strings = __webpack_require__(105);
Object.keys(strings).forEach(function (key) {
    String['locales'] = String['locales'] || {};
    String['locales']['en'] = String['locales']['en'] || {};
    String['locales']['en'][key] = strings[key]['en'];
});
String['toLocaleString'].call(this, { en: String['locales']['en'] });


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
/**
 * The _UserActions_ component allows your agents to see the actions performed by the end-user before or after the creation of a case within the Salesforce console.
 *
 * The component takes the information from the Coveo Usage Analytics events performed during the visit in which the case was created,
 * as seen from the Visit Browser page of the Coveo Cloud Administration Console (see [Reviewing User Visits With the Visit Browser](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=138)).
 *
 * You can configure which events the component displays.
 *
 * The component typically appears in a tab of the Insight Panel, but can also be included as a standalone component in a Visualforce page (see [Implementing the UserActions Component](https://developers.coveo.com/x/J4CpAQ)).
 *
 * In an Insight Panel, the component would look like this:
 *
 * ```html
 * <div class="CoveoBoxPopup" data-title="User actions" data-full-width="true" data-full-height="true" data-icon="coveo-sprites-tab-people">
 *   <div class="CoveoUserActions"></div>
 * </div>
 * ```
 *
 * To add the UserActions component as a standalone component, you need to add the UserActions Visualforce Component in your Visualforce page (see [UserActions Visualforce Component](https://developers.coveo.com/x/TICpAQ)).
 *
 * You also need to create a custom handler to open/close the component, or you can simply use the `showButton` property.
 *
 * ```html
 * <div class="CoveoUserActions" data-bind-on-box="false" data-show-button="true"></div>
 * ```
 */
var UserActions = /** @class */ (function (_super) {
    __extends(UserActions, _super);
    function UserActions(element, options, bindings) {
        var _this = _super.call(this, element, UserActions.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, UserActions, options);
        $(_this.root).on(coveo_search_ui_1.AnalyticsEvents.changeAnalyticsCustomData, $.proxy(_this.handleChangeAnalyticsEvents, _this));
        if (typeof userActionsHandler != 'undefined') {
            _this.setHandler(userActionsHandler);
        }
        _this.render();
        if (_this.options.enableBindOnBox) {
            $(element)
                .closest('.CoveoBoxPopup')
                .on('onPopupOpen', function () {
                _this.open();
            });
        }
        return _this;
    }
    UserActions.prototype.setHandler = function (handler) {
        this.handler = handler;
    };
    UserActions.prototype.setFilters = function (filters) {
        this.options.filters = filters;
    };
    UserActions.prototype.handleChangeAnalyticsEvents = function (e, args) {
        if (args.actionType == coveo_search_ui_1.analyticsActionCauseList.getUserHistory.type ||
            args.actionType == coveo_search_ui_1.analyticsActionCauseList.userActionDocumentClick.type) {
            args.originLevel2 = UserActions.ID;
        }
    };
    UserActions.prototype.render = function () {
        var _this = this;
        if (this.options.showButton) {
            var button = this.renderButton()
                .appendTo(this.element)
                .click(function () {
                _this.toggle();
            });
        }
        this.loadingBox = $(coveo_search_ui_1.DomUtils.getBasicLoadingAnimation())
            .hide()
            .appendTo(this.element);
        this.eventListBox = $('<div>')
            .addClass('coveo-useractions-events-list')
            .hide()
            .appendTo(this.element);
    };
    /**
     * This method opens the `UserActions` component.
     *
     * ```js
     * $('#myUserAction').coveo('open');
     * ```
     */
    UserActions.prototype.open = function () {
        var _this = this;
        if (this.eventListBox.is(':empty') && this.handler != null) {
            this.loadingBox.show();
            this.usageAnalytics.logCustomEvent(coveo_search_ui_1.analyticsActionCauseList.getUserHistory, null, this.element);
            this.handler.getDataFromUA(function (sessions) {
                _this.renderEvents(sessions);
            });
        }
        else {
            this.eventListBox.slideDown();
        }
    };
    /**
     * This method opens or closes the `UserActions` component, depending on its current state.
     *
     * ```js
     * $('#myUserAction').coveo('toggle');
     * ```
     */
    UserActions.prototype.toggle = function () {
        if (this.eventListBox.is(':visible')) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * This method closes the `UserActions` component.
     *
     * ```js
     * $('#myUserAction').coveo('toggle');
     * ```
     */
    UserActions.prototype.close = function () {
        if (this.eventListBox.is(':visible')) {
            this.eventListBox.slideUp();
        }
    };
    UserActions.prototype.renderEvents = function (visits) {
        var _this = this;
        this.eventListBox.empty();
        if (visits.message != null) {
            this.logger.info(visits.message, visits.type, visits);
            if (visits.type == 'NoVisitIdError') {
                $('<span>')
                    .text(coveo_search_ui_1.l('UserActionsNoVisitId'))
                    .addClass('coveo-useractions-nodata')
                    .appendTo(this.eventListBox);
            }
            else if (visits.type == 'DateRangeUnavailable') {
                $('<span>')
                    .text(visits.message)
                    .addClass('coveo-useractions-nodata')
                    .appendTo(this.eventListBox);
            }
            else {
                $('<span>')
                    .text(coveo_search_ui_1.l('UserActionsErrorOccured'))
                    .addClass('coveo-useractions-nodata')
                    .appendTo(this.eventListBox);
            }
        }
        else if (visits.totalNumberOfVisits > 0) {
            if (visits.visits[0].numberOfEvents > 0) {
                this.renderHeaderBox(visits.visits[0]).appendTo(this.eventListBox);
                _.each(visits.visits[0].events, function (event) {
                    if (_.contains(_this.options.filters, event.eventMetadata.actionCause) ||
                        _.contains(_this.options.filters, event.eventMetadata.customEventValue)) {
                        _this.renderEvent(event).appendTo(_this.eventListBox);
                    }
                });
            }
        }
        else {
            $('<span>')
                .text(coveo_search_ui_1.l('NoData'))
                .addClass('coveo-useractions-nodata')
                .appendTo(this.eventListBox);
        }
        this.loadingBox.hide();
        this.eventListBox.slideToggle();
    };
    UserActions.prototype.renderEvent = function (event) {
        var box = $('<div>').addClass('coveo-useractions-event');
        var rightBox = $('<div>')
            .addClass('coveo-useractions-event-right')
            .appendTo(box);
        var leftBox = $('<div>')
            .addClass('coveo-useractions-event-left')
            .appendTo(box);
        this.renderField(coveo_search_ui_1.l('Time'), new Date(event.dateTime).toLocaleTimeString()).appendTo(leftBox);
        if (event.eventMetadata.documentTitle && event.eventMetadata.documentURL) {
            this.renderLinkField(coveo_search_ui_1.l('Document'), event.eventMetadata.documentTitle, event.eventMetadata.documentURL).appendTo(rightBox);
        }
        if (event.eventMetadata.queryExpression) {
            this.renderField(coveo_search_ui_1.l('UserQuery'), event.eventMetadata.queryExpression).appendTo(rightBox);
        }
        if (event.eventMetadata.customEventValue == 'pageView') {
            this.renderLinkField(event.type, event.eventMetadata.originLevel3, event.eventMetadata.originLevel3).appendTo(rightBox);
        }
        else if (event.eventMetadata.customEventValue) {
            this.renderField(event.type, event.eventMetadata.customEventValue).appendTo(rightBox);
        }
        if (rightBox.is(':empty')) {
            this.renderField(coveo_search_ui_1.l('EventType'), event.type + (event.eventMetadata.actionCause ? ', ' + event.eventMetadata.actionCause : '')).appendTo(rightBox);
        }
        return box;
    };
    UserActions.prototype.renderField = function (fieldTitle, fieldValue) {
        var fieldBox = $('<div>');
        if (fieldValue) {
            $('<span>')
                .addClass('coveo-useractions-event-title')
                .text(fieldTitle)
                .appendTo(fieldBox);
            $('<span>')
                .addClass('coveo-useractions-event-value-expand')
                .text(fieldValue)
                .appendTo(fieldBox);
        }
        return fieldBox;
    };
    UserActions.prototype.renderLinkField = function (fieldTitle, fieldValue, fieldLink) {
        var _this = this;
        var fieldBox = $('<div>');
        if (fieldValue) {
            $('<span>')
                .addClass('coveo-useractions-event-title')
                .text(fieldTitle)
                .appendTo(fieldBox);
            $('<a>')
                .addClass('coveo-useractions-event-value-expand CoveoResultLink')
                .text(fieldValue)
                .attr('href', fieldLink)
                .attr('target', '_blanc')
                .appendTo(fieldBox)
                .click(function () {
                _this.usageAnalytics.logCustomEvent(coveo_search_ui_1.analyticsActionCauseList.userActionDocumentClick, {
                    author: null,
                    documentTitle: fieldValue,
                    documentURL: fieldLink
                }, _this.element);
            });
        }
        return fieldBox;
    };
    UserActions.prototype.renderHeaderBox = function (session) {
        var box = $('<div>')
            .addClass('coveo-useractions-event')
            .addClass('coveo-useractions-event-header');
        var rightBox = $('<div>')
            .addClass('coveo-useractions-event-right')
            .appendTo(box);
        var leftBox = $('<div>')
            .addClass('coveo-useractions-event-left')
            .appendTo(box);
        var startDate = new Date(session.events[0].dateTime).toDateString();
        var startTime = new Date(session.events[0].dateTime).toLocaleTimeString();
        var duration = coveo_search_ui_1.DateUtils.timeBetween(new Date(session.events[0].dateTime), new Date(session.events[session.numberOfEvents - 1].dateTime));
        this.renderField(coveo_search_ui_1.l('StartDate'), startDate).appendTo(leftBox);
        this.renderField(coveo_search_ui_1.l('StartTime'), startTime)
            .css('float', 'left')
            .appendTo(rightBox);
        this.renderField(coveo_search_ui_1.l('DurationTitle'), duration)
            .css('float', 'right')
            .appendTo(rightBox);
        return box;
    };
    UserActions.prototype.renderButton = function () {
        return $('<div>')
            .addClass('coveo-useractions-button')
            .append($('<span>').text(coveo_search_ui_1.l('ShowUserActions').toUpperCase()));
    };
    UserActions.ID = 'UserActions';
    UserActions.DEFAULT_FILTERS = ['searchboxSubmit', 'documentOpen', 'documentQuickview', 'pageVisit', 'pageView', 'createCase'];
    /**
     * The available options for UserAction
     * @componentOptions
     */
    UserActions.options = {
        /**
         * Specifies if the component should render a button to open/close itself.
         *
         * Default value is `false`.
         *
         * ```html
         * <div class="CoveoUserActions" data-show-button="true"></div>
         * ```
         */
        showButton: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies if the component should listen to the `onPopupOpen` event fired by the closest `BoxPopup` component to open itself.
         *
         * Default value is `true`.
         *
         * ```html
         * <div class="CoveoUserActions" data-enable-bind-on-box="false"></div>
         * ```
         */
        enableBindOnBox: coveo_search_ui_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies which events the `UserActions` component should display.
         *
         * You typically want to include only events that are manually performed by the end-users, including appropriate custom events, and omitting the ones that are generated automatically by the components.
         *
         * These typically are the `Click`, `Search`, and `Custom` dimension causes (see [Usage Analytics Dimensions](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=106)).
         */
        filters: coveo_search_ui_1.ComponentOptions.buildListOption({ defaultValue: UserActions.DEFAULT_FILTERS })
    };
    return UserActions;
}(coveo_search_ui_1.Component));
exports.UserActions = UserActions;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(UserActions);


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var BoxFollowItem = /** @class */ (function (_super) {
    __extends(BoxFollowItem, _super);
    function BoxFollowItem(element, options, bindings, result) {
        var _this = _super.call(this, element, options, bindings, result) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        return _this;
    }
    BoxFollowItem.getMarkup = function () {
        return $('<div class="CoveoBoxFollowItem"></div>');
    };
    BoxFollowItem.prototype.getTitle = function (displayedInline) {
        var _this = this;
        this.menuDiv = $('<div class="coveo-box-follow-item-in-menu">' + this.getText() + '</div>').get(0);
        $(this.menuDiv).click(function () {
            _this.toggleFollow();
        });
        return this.menuDiv;
    };
    BoxFollowItem.prototype.setFollowed = function (subscription) {
        _super.prototype.setFollowed.call(this, subscription);
        this.menuDiv.innerText = this.getText();
    };
    BoxFollowItem.prototype.setNotFollowed = function () {
        _super.prototype.setNotFollowed.call(this);
        this.menuDiv.innerText = this.getText();
    };
    BoxFollowItem.ID = 'BoxFollowItem';
    return BoxFollowItem;
}(coveo_search_ui_1.FollowItem));
exports.BoxFollowItem = BoxFollowItem;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxFollowItem);


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var SalesforceResultLink_1 = __webpack_require__(8);
var BoxResultLink = /** @class */ (function (_super) {
    __extends(BoxResultLink, _super);
    function BoxResultLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoxResultLink.ID = 'BoxResultLink';
    return BoxResultLink;
}(SalesforceResultLink_1.SalesforceResultLink));
exports.BoxResultLink = BoxResultLink;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxResultLink);


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var BoxSearchAlerts = /** @class */ (function (_super) {
    __extends(BoxSearchAlerts, _super);
    function BoxSearchAlerts(element, options, bindings) {
        var _this = _super.call(this, element, coveo_search_ui_1.ComponentOptions.initComponentOptions(element, BoxSearchAlerts, options), bindings) || this;
        _this.element = element;
        _this.options = options;
        $(_this.root)
            .find('.coveo-box-header-sub-section-wrapper')
            .css('margin-top', '40px');
        return _this;
    }
    BoxSearchAlerts.getMarkup = function () {
        return $('<div class="CoveoBoxSearchAlerts"></div>');
    };
    BoxSearchAlerts.prototype.openPanel = function () {
        var _this = this;
        return this.queryController
            .getEndpoint()
            .listSubscriptions()
            .then(function (subscriptions) {
            if (subscriptions.length > 0) {
                _this.redirectToManageAlertsPage(subscriptions[0].user);
            }
            else {
                _this.message.showMessage(coveo_search_ui_1.$$(_this.findQueryBoxDom()), coveo_search_ui_1.l('SearchAlerts_PanelNoSearchAlerts'), true);
            }
            return subscriptions[0];
        });
    };
    BoxSearchAlerts.prototype.redirectToManageAlertsPage = function (subscriptionUser) {
        var url = this.queryController.getEndpoint().getBaseAlertsUri() +
            '/subscriptions/email?email=' +
            encodeURIComponent(subscriptionUser.email) +
            '&manageToken=' +
            encodeURIComponent(subscriptionUser.manageToken);
        // Todo : It would be nice to try to open this in a console subtab, but unfortunately the coveo platform set X-frame option : Deny.
        window.open(url);
    };
    BoxSearchAlerts.ID = 'BoxSearchAlerts';
    return BoxSearchAlerts;
}(coveo_search_ui_1.SearchAlerts));
exports.BoxSearchAlerts = BoxSearchAlerts;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(BoxSearchAlerts);


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var ContainerInjection = /** @class */ (function () {
    function ContainerInjection() {
        this.editableAttributes = {};
        this.logger = new coveo_search_ui_1.Logger(this);
    }
    ContainerInjection.prototype.withHeader = function (headerKlass) {
        if (this.headerKlass) {
            this.loggerInfo('ContainerHeader', headerKlass, this.headerKlass);
        }
        this.headerKlass = headerKlass;
        var toSetAsEditable = this.fromComponentOptionsToContainerInjectionEditable(headerKlass.options);
        if (toSetAsEditable) {
            if (this.editableAttributes['header']) {
                this.loggerInfo('ContainerHeaderEditAttribute', this.editableAttributes['header'], toSetAsEditable);
            }
            this.editableAttributes['header'] = toSetAsEditable;
        }
        return this;
    };
    ContainerInjection.prototype.withBody = function (bodyKlass) {
        if (this.bodyKlass) {
            this.loggerInfo('ContainerBody', bodyKlass, this.bodyKlass);
        }
        this.bodyKlass = bodyKlass;
        var toSetAsEditable = this.fromComponentOptionsToContainerInjectionEditable(bodyKlass.options);
        if (toSetAsEditable) {
            if (this.editableAttributes['body']) {
                this.loggerInfo('ContainerBodyEditAttribute', this.editableAttributes['body'], toSetAsEditable);
            }
            this.editableAttributes['body'] = toSetAsEditable;
        }
        return this;
    };
    ContainerInjection.prototype.withFooter = function (footerKlass) {
        if (this.footerKlass) {
            this.loggerInfo('ContainerFooter', footerKlass, this.footerKlass);
        }
        this.footerKlass = footerKlass;
        var toSetAsEditable = this.fromComponentOptionsToContainerInjectionEditable(footerKlass.options);
        if (toSetAsEditable) {
            if (this.editableAttributes['footer']) {
                this.loggerInfo('ContainerFooterEditAttribute', this.editableAttributes['footer'], toSetAsEditable);
            }
            this.editableAttributes['footer'] = toSetAsEditable;
        }
        return this;
    };
    ContainerInjection.prototype.withQuery = function (queryKlass) {
        if (this.queryKlass) {
            this.loggerInfo('ContainerQuery', queryKlass, this.queryKlass);
        }
        this.queryKlass = queryKlass;
        var toSetAsEditable = this.fromComponentOptionsToContainerInjectionEditable(queryKlass.options);
        if (toSetAsEditable) {
            if (this.editableAttributes['query']) {
                this.loggerInfo('ContainerQueryEditAttribute', this.editableAttributes['query'], toSetAsEditable);
            }
            this.editableAttributes['query'] = toSetAsEditable;
        }
        return this;
    };
    ContainerInjection.prototype.withOptions = function (options) {
        var toSet = this.fromComponentOptionsToContainerInjectionEditable(options);
        if (this.editableAttributes['options']) {
            this.loggerInfo('ContainerEditAttribute', this.editableAttributes['options'], toSet);
        }
        this.editableAttributes['options'] = toSet;
        return this;
    };
    ContainerInjection.prototype.withContext = function (contextKlass) {
        if (this.contextKlass) {
            this.loggerInfo('ContainerFooter', contextKlass, this.contextKlass);
        }
        this.contextKlass = contextKlass;
        var toSetAsEditable = this.fromComponentOptionsToContainerInjectionEditable(contextKlass.options);
        if (toSetAsEditable) {
            if (this.editableAttributes['context']) {
                this.loggerInfo('ContainerContextEditAttribute', this.editableAttributes['context'], toSetAsEditable);
            }
            this.editableAttributes['context'] = toSetAsEditable;
        }
        return this;
    };
    ContainerInjection.prototype.getAttributes = function () {
        return _.chain(this.editableAttributes)
            .map(function (v) {
            return _.map(v, function (attr) {
                return attr;
            });
        })
            .flatten()
            .value();
    };
    ContainerInjection.prototype.loggerInfo = function (part, oldPart, newPart) {
        this.logger.info(part + ' is already added for this container. Overwriting current one.', oldPart, newPart);
    };
    ContainerInjection.prototype.fromComponentOptionsToContainerInjectionEditable = function (options) {
        var ret = {};
        _.each(options, function (v, k) {
            ret[k] = { name: k, defaultValue: v.defaultValue };
        });
        if (_.isEmpty(ret)) {
            return undefined;
        }
        return ret;
    };
    return ContainerInjection;
}());
exports.ContainerInjection = ContainerInjection;


/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = {"AttachedResultsTab":{"en":"Attached results"},"AttachedResultsTab_description":{"en":"This component displays all attached results"},"AttachedResultsTab_id":{"en":"Unique ID"},"AttachedResultsTab_caption":{"en":"Caption"},"AttachedResultsTab_icon":{"en":"Icon"},"AttachedResultsTab_expression":{"en":"Filter expression"},"AttachedResultsTab_endpoint":{"en":"Endpoint"},"AttachedResultsTab_sort":{"en":"Default sort"},"AttachedResultsTab_constant":{"en":"Add filter to constant query (cq)"},"AttachedResultsTab_pipeline":{"en":"Query pipeline"},"AttachedResultsTab_enableDuplicateFiltering":{"en":"Enable duplicate filtering"},"AttachedResultsTab_maximumAge":{"en":"Maximum age in milliseconds that cached query results can have in order to be used"},"BoxQuerySome":{"en":"Related items"},"BoxQuerySome_description":{"en":"This component extracts the most important keywords from the provided field in the current Salesforce record and adds them to the query."},"BoxQuerySome_best":{"en":"Number of best keywords to include in the query"},"BoxQuerySome_best_description":{"en":"Specifies the number (absolute or percentage value) of best query keywords to include in the query. Less frequent keywords in the index are considered better than common keywords. "},"BoxQuerySome_match":{"en":"Number of keywords to match in documents"},"BoxQuerySome_match_description":{"en":"Specifies the number (absolute or percentage value) of query keywords that documents must contain. "},"BoxQuerySome_removeStopWords":{"en":"Remove stop words"},"BoxQuerySome_disableOnNonContextualSearch":{"en":"Disable on non contextual search"},"BoxQuerySome_includeCurrentRecord":{"en":"Include the current record in results"},"BoxQuerySome_include":{"en":"Include"},"BoxQuerySome_bindOnQuery":{"en":"Bind on query"},"BoxQuerySome_useSomeQRE":{"en":"Use the $some QRE for related items"},"BoxHeader":{"en":"Header"},"BoxHeader_enableQuerySyntax":{"en":"Enable query syntax"},"BoxHeader_includeSettings":{"en":"Include settings"},"BoxHeader_addSearchButton":{"en":"Add search button"},"BoxHeader_enableFieldAddon":{"en":"Enable field addon"},"BoxHeader_enableQueryExtensionAddon":{"en":"Enable query extension addon"},"BoxHeader_enableQuerySuggestAddon":{"en":"Enable Coveo Machine Learning query suggestions addon"},"BoxHeader_inline":{"en":"Show Omnibox results inline"},"BoxHeader_allowNonContextualSearch":{"en":"Allow non contextual search"},"BoxHeader_description":{"en":"Header of the box that acts as a container for other components"},"BoxHeader_includeSearchbox":{"en":"Include search box"},"BoxHeader_icon":{"en":"Icon"},"BoxHeader_title":{"en":"Title"},"BoxHeader_includeSubSection":{"en":"Include sub section"},"BoxHeader_openSubSectionByDefault":{"en":"Open sub section by default"},"BoxHeader_enableOmnibox":{"en":"Activate Omnibox"},"BoxHeader_enableOmnibox_description":{"en":"If true, the search box instantiates an Omnibox component. Otherwise, the search box instantiates a Querybox component. "},"BoxHeader_omniboxDelay":{"en":"Omnibox delay"},"BoxHeader_omniboxDelay_description":{"en":"Specifies the delay (in milliseconds) before the Omnibox triggers the event asking for components to provide suggestions based on the box content. "},"BoxHeader_omniboxTimeout":{"en":"Omnibox timeout"},"BoxHeader_omniboxTimeout_description":{"en":"Specifies the delay (in milliseconds) before the Omnibox cancels any deferred request that was pushed when providing suggestions for the Omnibox. The default value is 2000."},"BoxHeader_omniboxChangeLimit":{"en":"Omnibox character change limit"},"BoxHeader_omniboxChangeLimit_description":{"en":"Specifies the maximum number of letter changes in the Omnibox before cancelling any deferred request that was pushed when providing suggestions for the Omnibox. The default value is 3."},"BoxHeader_omniboxMinimumLetters":{"en":"Omnibox letters"},"BoxHeader_omniboxMinimumLetters_description":{"en":"Specifies the minimum number of letters that must be present in the Omnibox before it begins to request content to all components."},"BoxHeader_autoFocus":{"en":"Auto focus"},"BoxHeader_autoFocus_description":{"en":"Specifies whether the Querybox gets the focus and is selected on initialization. "},"BoxHeader_disableQuerySyntax":{"en":"Disable query syntax"},"BoxHeader_disableQuerySyntax_description":{"en":"Specifies whether the Coveo Platform does not try to interpret special query syntax such as field references in the query entered through the query box. "},"BoxHeader_enableLowercaseOperators":{"en":"Enable lowercase operators"},"BoxHeader_enableLowercaseOperators_description":{"en":"Specifies whether to also interpret lowercase keywords (like: or, and) as operators. When false, only uppercase keywords (Or, AND) are recognized as operators. "},"BoxHeader_enablePartialMatch":{"en":"Enable partial match"},"BoxHeader_enablePartialMatch_description":{"en":"Specifies whether a query containing a large number of keywords is automatically converted to a partial match expression to only match documents containing a subset of the keywords. "},"BoxHeader_enableQuestionMarks":{"en":"Enable question marks"},"BoxHeader_enableQuestionMarks_description":{"en":"Specifies whether a question mark character (?) in a query is interpreted as a wildcard. "},"BoxHeader_enableSearchAsYouType":{"en":"Enable search-as-you-type"},"BoxHeader_enableSearchAsYouType_description":{"en":"Specifies whether a new query is automatically triggered whenever the user types in new text inside the query box. "},"BoxHeader_enableWildcards":{"en":"Enable wildcards"},"BoxHeader_enableWildcards_description":{"en":"Specifies whether the Coveo Platform expands keywords containing wildcard characters to the possible matching keywords to broaden the query. "},"BoxHeader_partialMatchKeywords":{"en":"Partial match keywords"},"BoxHeader_partialMatchKeywords_description":{"en":"When partial match is enabled, this option specifies the minimum number of keywords that must be present in the query for to activate partial match. "},"BoxHeader_partialMatchThreshold":{"en":"Partial match threshold"},"BoxHeader_partialMatchThreshold_description":{"en":"Specifies the minimum number of keywords that a document must contain to be included in search results."},"BoxHeader_searchAsYouTypeDelay":{"en":"Search-as-you-type delay"},"BoxHeader_searchAsYouTypeDelay_description":{"en":"When search-as-you-type is enabled, specifies the delay in milliseconds before a new query is triggered when the user types in new text inside the query box. "},"BoxHeader_triggerQueryOnClear":{"en":"Trigger new query on clear"},"BoxHeader_placeholder":{"en":"Placeholder text"},"BoxBody":{"en":"Body"},"BoxBody_resultTemplate":{"en":"Result template"},"BoxBody_enableInfiniteScrollWaitingAnimation":{"en":"Enable infinite scroll waiting animation"},"BoxBody_fieldsToInclude":{"en":"Fields to include"},"BoxBody_autoSelectFieldsToInclude":{"en":"Auto select fields to include"},"BoxBody_enableInfiniteScroll":{"en":"Enable infinite scroll"},"BoxBody_enableInfiniteScroll_description":{"en":"Specifies whether the ResultList automatically retrieves an additional page of results and appends them to those already being displayed whenever the user scrolls to the end of the infiniteScrollContainer. The wait animation is displayed while additional results are fetched. "},"BoxBody_infiniteScrollContainer":{"en":"Infinite scroll container"},"BoxBody_infiniteScrollContainer_description":{"en":"specifies the element whose scrolling is monitored to trigger fetching of additional results. If this option is not specified, the component bound element will be used."},"BoxBody_infiniteScrollPageSize":{"en":"Infinite scroll page size"},"BoxBody_infiniteScrollPageSize_description":{"en":"Specifies the number of additional results that are fetched when the user scrolls to the bottom of the infiniteScrollContainer. "},"BoxBody_mobileScrollContainer":{"en":"Mobile scroll container"},"BoxBody_mobileScrollContainer_description":{"en":"Specifies the element whose scrolling is monitored to trigger fetching of additional results for mobile. If this option is not specified, the component bound element will be used."},"BoxBody_resultContainer":{"en":"Result container"},"BoxBody_resultContainer_description":{"en":"Specifies the element within which the rendered HTML templates for results will be inserted. The content of this element is cleared when a new query is performed."},"BoxBody_resultTemplateId":{"en":"Result template ID"},"BoxBody_resultTemplateId_description":{"en":"Specifies the ID of the search result template used to render results in HTML."},"BoxBody_resultTemplateSelector":{"en":"Result template selector"},"BoxBody_resultTemplateSelector_description":{"en":"Specifies the CSS selector matching an element that defines a template within the page to use to render results in HTML. "},"BoxBody_showInfiniteScrollWaitingAnimation":{"en":"Show infinite scroll waiting animation"},"BoxBody_showInfiniteScrollWaitingAnimation_description":{"en":"Show infinite scroll waiting animation"},"BoxBody_waitAnimation":{"en":"Wait animation"},"BoxBody_waitAnimation_description":{"en":"Specifies the type of animation to display while waiting for a new query to finish executing. Available values are: fade, spinner, none (default)."},"BoxBody_waitAnimationContainer":{"en":"Wait animation container"},"BoxBody_waitAnimationContainer_description":{"en":"Specifies the element inside which an animation is displayed while waiting for a new query to finish executing. By default, the animation appears in the the resultContainer."},"componentOption_include":{"en":"Contextual fields to include"},"componentOption_include_description":{"en":"Specifies contextual fields to include as keywords in the current query. Only includes the most important keywords from those fields."},"componentOption_best":{"en":"Number of keywords to extract"},"componentOption_best_description":{"en":"Specifies that only the X best keywords of those provided are to be matched. Keywords that occur less frequently in the index are considered better than those that are very common."},"componentOption_match":{"en":"Number of keywords that results must match"},"componentOption_match_description":{"en":"Specifies that documents containing only X or greater keywords of those provided are to be matched."},"componentOption_removeStopWords":{"en":"Remove stop words"},"componentOption_removeStopWords_description":{"en":"Specifies if stop words should be removed from the keywords. Stop words are common words that the index can filter out when ranking the documents (e.g.: the, is, at, on..."},"BoxQueryExtensions":{"en":"Ranking expression"},"BoxQueryExtensions_description":{"en":"Adds standard query extensions to fine tune the relevancy of your results."},"BoxQueryExtensions_disableOnNonContextualSearch":{"en":"Disable on non contextual search"},"BoxPopup":{"en":"Popup container"},"BoxPopup_description":{"en":"This component acts as a generic container for other components which open when clicked."},"BoxPopup_title":{"en":"Title"},"BoxPopup_withAnimation":{"en":"Open with animation"},"BoxPopup_fullWidth":{"en":"Take full page width"},"BoxPopup_fullHeight":{"en":"Take full page height"},"BoxPopup_hidden":{"en":"Hidden"},"QueryComponents":{"en":"Query Components"},"MANDATORY":{"en":"Mandatory"},"HIGHEST":{"en":"Highest"},"HIGH":{"en":"High"},"AVERAGE":{"en":"Average"},"LOW":{"en":"Low"},"LOWEST":{"en":"Lowest"},"BoxRelatedContext":{"en":"Relations"},"BoxQueryGeneric":{"en":"Query"},"BoxQueryGeneric_description":{"en":"Adds any valid query expression to fine tune the relevancy of your results. "},"BoxQueryGeneric_disableOnNonContextualSearch":{"en":"Disable on non contextual search"},"Box_withAnalytics":{"en":"With analytics component"},"Box_searchPageUri":{"en":"Search page URI"},"Box_enableHistory":{"en":"Enable history"},"Box_pipeline":{"en":"Pipeline"},"Box_maximumAge":{"en":"Maximum age"},"Box_enableAutomaticResponsiveMode":{"en":"Enable automatic responsive mode"},"Box_enableDuplicateFiltering":{"en":"Enable duplicate filtering"},"Box_resultsPerPage":{"en":"Results per page"},"Box_excerptLength":{"en":"Excerpt length"},"Box_excerptLength_description":{"en":"Specifies the number of characters of the excerpt to get at query time and display for each query result."},"Box_expression":{"en":"Hidden expression"},"Box_filterField":{"en":"Filter field"},"Box_hideUntilFirstQuery":{"en":"Hide until first query"},"Box_firstLoadingAnimation":{"en":"First loading animation"},"Box_autoTriggerQuery":{"en":"Auto trigger query"},"Box_endpoint":{"en":"Endpoint"},"Box_timezone":{"en":"Timezone"},"Box_enableDebugInfo":{"en":"Enable debug info"},"Box_type":{"en":"Type"},"BoxExpandLink":{"en":"Expand link"},"BoxExpandLink_description":{"en":"Expands the current panel to a full Coveo search page, transferring the current state of the query. "},"BoxExpandLink_uri":{"en":"Target page URI"},"BoxExpandLink_hd":{"en":"Target page filter description"},"BoxExpandLink_targetTab":{"en":"Target page tab to open"},"BoxExpandLink_icon":{"en":"Icon"},"BoxExpandLink_title":{"en":"Salesforce tab title"},"BoxExpandLink_toPrimaryTab":{"en":"Open in a primary Salesforce tab"},"BoxEditLink":{"en":"Edit link"},"BoxEditLink_icon":{"en":"Icon"},"BoxEditLink_uri":{"en":"Target edit page URI"},"BoxCreateArticle":{"en":"Create Article"},"BoxCreateArticle_description":{"en":"Opens a new tab in order to create an Article"},"BoxCreateArticle_articleTypeFilter":{"en":"Article type filter"},"BoxCreateArticle_hidden":{"en":"Hidden"},"BoxCreateArticle_openInPrimaryTab":{"en":"Open in primary tab"},"BoxResultAction":{"en":"Result actions"},"BoxResultAction_menuDelay":{"en":"Menu delay"},"BoxResultAction_menuDelay_description":{"en":"Specfies the delay, in ms, before the menu closes on mouseout. "},"BoxResultAction_displayInline":{"en":"Display menu inline"},"BoxResultAction_displayInline_description":{"en":"Specifies whether the components contained inside the ResultAction are instead displayed 'inline', and not inside a clickable menu."},"Box_Quickview":{"en":"Quick View"},"BoxQuickview":{"en":"Quick View"},"Box_Quickview_description":{"en":"This component creates a button/link inside the result list that opens a Quick View dialog box for a given result."},"BoxQuickview_title":{"en":"Title"},"BoxQuickview_title_description":{"en":"Specifies the title that appears at the top of the Quick View dialog box."},"BoxQuickview_showDate":{"en":"Show date"},"BoxQuickview_showDate_description":{"en":"Specifies whether to show the date in the header of the Quick View. "},"BoxQuickview_enableLoadingAnimation":{"en":"Enable loading animation"},"BoxQuickview_contentTemplateSelector":{"en":"Content template CSS selector"},"BoxQuickview_contentTemplateId":{"en":"Content template script ID"},"BoxQuickview_loadingAnimation":{"en":"Loading animation CSS selector"},"InsertANewComponent":{"en":"Insert a new component"},"InsertANewComponentEmpty":{"en":"No components in menu"},"InsertANewComponentEmptyDescription":{"en":"Click + to insert new components inside the menu"},"BoxFieldTable":{"en":"Field table"},"BoxFieldTable_useJsonTemplateFields":{"en":"Use JSON template fields"},"BoxFieldTable_expandedTitle":{"en":"Expanded title"},"BoxFieldTable_minimizedTitle":{"en":"Minimized title"},"BoxFieldTable_minimizedByDefault":{"en":"Minimized by default"},"BoxFieldTable_allowMinimization":{"en":"Allow minimization"},"BoxResultLink":{"en":"Result link"},"BoxResultLink_description":{"en":"Clickable link that points to the original document."},"BoxResultLink_alwaysOpenInNewWindow":{"en":"Always open in new window"},"BoxResultLink_alwaysOpenInNewWindow_description":{"en":"Specifies whether the result link should always open in a new window."},"BoxResultLink_field":{"en":"Field"},"BoxResultLink_field_description":{"en":"Specifies the field that the result link should use to output its href."},"BoxResultLink_openInOutlook":{"en":"Open in Microsoft Outlook"},"BoxResultLink_openInOutlook_description":{"en":"Specifies whether the result link tries to open in Microsoft Outlook. This is normally intended for ResultLink related to Microsoft Exchange emails."},"BoxResultLink_openQuickview":{"en":"Open in Quick View"},"BoxResultLink_openQuickview_description":{"en":"Specifies whether the result link should open in a Quick View instead of loading through the original URL."},"BoxResultLink_openInPrimaryTab":{"en":"Open in a primary Salesforce console tab"},"BoxResultLink_openInSubTab":{"en":"Open in a sub Salesforce console tab"},"BoxResultLink_openInSameBrowserTab":{"en":"Open in the same browser tab"},"ShowDetails":{"en":"Show details"},"HideDetails":{"en":"Hide details"},"SelectNonContextualSearch":{"en":"Remove the current record context to broaden your search"},"QuerySummaryInfiniteScrolling":{"en":"{0}-{1} on {3} result<pl>s</pl>"},"ExtensionsEmpty":{"en":"No Extensions"},"ExtensionsEmptyDescription":{"en":"Click + to insert new extensions"},"RemoveContext":{"en":"Remove context"},"Box_useLocalStorageForBoxState":{"en":"Use local storage for box state"},"Box_enableBoxStateHistory":{"en":"Enable box state history"},"Box_enableCollaborativeRating":{"en":"Enable collaborative rating"},"Box_useLocalStorageForHistory":{"en":"Use local storage for history"},"BoxCurrentTab":{"en":"Current tab"},"BoxCurrentSort":{"en":"Box current sort"},"BoxQuerySummary":{"en":"Query summary"},"BoxPipelineContext":{"en":"Pipeline context"},"AddPipelineContext":{"en":"Add pipeline context"},"AddNewQueryExtension":{"en":"Add new query extension"},"UserActionsNoVisitId":{"en":"There are no user actions attached to this case"},"UserActionsErrorOccured":{"en":"An error occured while getting the user actions"}}

/***/ })
/******/ ]);(function(e, a) { for(var i in a) e[i] = a[i]; }(Coveo, Coveo_tmp_SF))