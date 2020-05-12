import { ConfigurationFactory } from 'webpack'
import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export const config: ConfigurationFactory = () => {
  return {
    entry: {
      popup: path.join(__dirname, 'src', 'popup.ts'),
      content_scripts: path.join(__dirname, 'src', 'content_scripts.ts'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /.ts$/,
          use: 'ts-loader',
          exclude: '/node_modules/'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    devtool: 'cheap-module-source-map',
    plugins: [
      new CopyWebpackPlugin([
        { from: 'public', to: '.' }
      ])
    ],
    mode: 'development'
  }
}
export default config
