const path = require("path");
const webpack = require("webpack");
const webpack_rules = [];
const webpackOption = {
    entry:{
		addcard:"./js/addcard/index.js",
		addcardset:"./js/addcardset/index.js",
		cardgame:"./js/cardgame/index.js",
		gameoverview:"./js/gameoverview/index.js",
		index:"./js/index/index.js",
		settings:"./js/settings/index.js",		
	},
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]-bundle.js",
    },
    module: {
        rules: webpack_rules
    },
};
let babelLoader = {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env"]
        }
    }
};
webpack_rules.push(babelLoader);
module.exports = webpackOption;