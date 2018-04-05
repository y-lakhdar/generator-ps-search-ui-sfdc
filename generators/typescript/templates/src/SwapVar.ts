declare global {
  interface Window {
    [propName: string]: any;
  }
}

// Webpack output a library target with a temporary name.
// It does not take care of merging the namespace if the global variable already exists.
// If another piece of code in the page use the Coveo namespace (eg: extension), then they get overwritten
// This code swap the current module to the "real" Coveo variable, without overwriting the whole global var.
// This is to allow end user to put CoveoPSComponents.js before or after the main CoveoJsSearch.js, without breaking

export function swapVar(scope: any) {
  if (window['Coveo'] === undefined) {
    window['Coveo'] = scope;
  } else {
    _.each(_.keys(scope), (k: any) => {
      window['Coveo'][k] = scope[k];
    });
  }
}
