import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'
import { ConfigurationFactory } from 'webpack'

export const config: ConfigurationFactory = () => {
  return {
    entry: {
      popup: path.join(__dirname, 'src', 'popup.ts'),
      /* eslint-disable @typescript-eslint/camelcase */
      content_scripts: path.join(__dirname, 'src', 'contentScripts.ts'),
      background: path.join(__dirname, 'src', 'backGround.ts'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /.ts?$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '.css'],
    },
    devtool: 'cheap-module-source-map',
    plugins: [new CopyWebpackPlugin([{ from: 'public', to: '.' }])],
    mode: 'development',
  }
}
export default config
