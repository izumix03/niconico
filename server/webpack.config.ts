import path from 'path'
import { ConfigurationFactory } from 'webpack'
import nodeExternals from 'webpack-node-externals'
export const config: ConfigurationFactory = () => {
  return {
    target: 'node',
    entry: {
      index: path.join(__dirname, 'src', 'index.ts'),
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
    externals: [nodeExternals()],
    devtool: 'cheap-module-source-map',
    mode: 'development'
  }
}
export default config
