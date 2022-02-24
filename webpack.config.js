const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'node_modules/@sap/nsc-client', to: './nsc-client' }
            ]
        })
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    }
};
