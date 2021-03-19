import * as MediaQuerySplittingPlugin from 'media-query-splitting-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration, Plugin } from 'webpack';
import { BuildExecutorSchema } from '../../../executors/build/schema';

function getExtraPlugins(options: BuildExecutorSchema) {
  const extraPlugins: Plugin[] = [];

  const { mediaQueriesConfig } = options;

  if (mediaQueriesConfig) {
    const mediaQueries = require(mediaQueriesConfig);

    if (typeof mediaQueries === 'object' && mediaQueries !== null) {
      extraPlugins
        .push
        // new MediaQuerySplittingPlugin({
        //   media: mediaQueries,
        //   minify: true,
        // })
        ();
    }
  }
  return extraPlugins;
}

export function getStylesWebpackPartialConfig(
  options: BuildExecutorSchema,
  chunksBaseName: string
): Configuration {
  const { postcssConfig } = options;

  const webpackConfig: Configuration = {
    module: {
      rules: [
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          sideEffects: true,
          use: [
            MiniCssExtractPlugin.loader,
            require.resolve('css-loader'),
            {
              loader: require.resolve('postcss-loader'),
              options: {
                implementation: require('postcss'),
                postcssOptions: {
                  config: postcssConfig,
                },
              },
            },
            require.resolve('sass-loader'),
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${chunksBaseName}.css`,
      }),
      ...getExtraPlugins(options),
    ],
  };

  return webpackConfig;
}
