const ExtractTextPlugin = require('extract-text-webpack-plugin');

const configureSassForProduction = (additionalRules, plugins, production) => {
  const cssFilename = production ? `../css/Coveo.<%= capitalizeCustomerSafeName %>[name].min.css` : `../css/Coveo.<%= capitalizeCustomerSafeName %>[name].css`;
  const extractSass = new ExtractTextPlugin({
    filename: cssFilename
  });
  additionalRules.push({
    test: /\.scss/,
    use: extractSass.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: false,
            root: 'bin',
            minimize: production
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            data: '$root-path: "../";'
          }
        }
      ],
      fallback: 'style-loader'
    })
  });
  plugins.push(extractSass);
  bail = true;
};

const configureSassForDev = (additionalRules, plugins, production) => {
  additionalRules.push({
    test: /\.scss/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          data: '$root-path: "../";'
        }
      }
    ]
  });
  bail = false;
};

module.exports = {
  configureSassForDev,
  configureSassForProduction
};
