# Daily Deal module for Magento PWA Studio


## What is this?

https://dailydeals.pwa-commerce.com/gumac-3.html

## Requirements

- Magento version 2.4.* or >= 2.3.5
- Got [Mageplaza Daily Deal extension](https://www.mageplaza.com/magento-2-daily-deal-extension/) and [Daily Deal GraphQL](http://dailydeal.pwa-commerce.com/) installed

## Installation

### 1. Init project
```
git clone https://github.com/Simicart/simi-studio --branch release/4.0.0
cd simi-studio
```

### 2. Start the project

From the root directory of the project you created above, clone the repository:

```
  git clone https://github.com/Simicart/dailydeals-module-pwa-studio ./@simicart/dailydeal
```

### 3. Modify .env

Change the .env MAGENTO_BACKEND_URL with your Magento site URL, or use our demo URL:

```
  MAGENTO_BACKEND_URL=https://mpmed.pwa-commerce.com/
```
### 4. Modify package.json

Modify the dependencies of your project to add Daily Deal extension.

```
  "dependencies": {
    ...
    "@simicart/dailydeal": "link:./@simicart/dailydeal",
    "react-material-ui-carousel": "^2.3.5"
    ...
  },
```

### 5. Install lib and Start Project

```
  yarn install && yarn watch
```

## Contribution

[SimiCart Team](https://www.simicart.com/pwa.html/) & [Mageplaza Team](https://www.mageplaza.com/)
