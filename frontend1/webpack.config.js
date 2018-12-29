const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
	mode:'development',
	devtool:'source-map',
	watch:true,
	module: {
  	rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				options: {
					presets: ['es2015'],
					plugins: ['transform-class-properties']
					}
			}
		]
	},
	plugins: [
		new BrowserSyncPlugin({
		// browse to http://localhost:3000/ during development,
		// ./public directory is being served
		host: 'localhost',
		port: 3000,
		server: { baseDir: ['dist'] }
    })
	]
};
