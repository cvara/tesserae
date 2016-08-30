var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		main: __dirname + '/src/tesserae'
	},

	output: {
		path: __dirname + '/dist',
		filename: 'tesserae.js',
		// export itself to a global var
		libraryTarget: 'var',
	    // name of the global var
	    library: 'Tesserae'
	},

	module: {
	    loaders: [{
	        test: /\.js$/,
	        exclude: /(node_modules|bower_components|vendor)/,
	        loader: 'babel', // 'babel-loader' is also a legal name to reference
	        query: {
	            presets: ['es2015'],
	            cacheDirectory: __dirname + '/.babel-cache'
	        }
	    }]
	},

	devtool: 'cheap-module-source-map',

	plugins: [
		// This replaces shim stuff in RequireJS.
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
		// Limit the number of generated chunks
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1 // no limit
		}),
		// Force min chunk size (to merge entry chunk with other chunks)
		new webpack.optimize.MinChunkSizePlugin({
			minChunkSize: 20 * 1024 // 20 KB
		})
	],

	externals: {
		'jquery': '$'
	},

	resolve: {
		root: [
			__dirname + '/src'
		],
		extensions: ['', '.js'],
		alias: {

		}
	}
};
