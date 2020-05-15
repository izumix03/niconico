import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'
import { ConfigurationFactory } from 'webpack'

export const config: ConfigurationFactory = () => {
  return {
    entry: {
      popup: path.join(__dirname, 'src', 'popup.tsx'),
      contentScripts: path.join(__dirname, 'src', 'contentScripts.ts'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
    },
    devtool: 'cheap-module-source-map',
    plugins: [new CopyWebpackPlugin([{ from: 'public', to: '.' }])],
    mode: 'development',
  }
}
export default config
