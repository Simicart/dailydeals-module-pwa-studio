# dailydeals-module-pwa-studio
Developing...
```
yarn add node-sass
yarn add sass-loader
```

modify packagejson
```
"dependencies": {
    ...
    "@giftcard/dailydeals": "link:./@simicart/dailydeals",
    ...
}
```

modify webpack.config.js
```
config.module.noParse = [/braintree\-web\-drop\-in/];
config.module.rules.push(
    {
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            'sass-loader'
        ]
    }
);
```
