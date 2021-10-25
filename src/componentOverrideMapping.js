/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
    [`@magento/venia-ui/lib/components/CategoryList/categoryList.js`]:'@simicart/dailydeal/src/override/CategoryList/categoryList.js',
    [`@magento/venia-ui/lib/components/Gallery/item.js`]:'@simicart/dailydeal/src/override/Item/item.js',
    [`@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js`]:'@simicart/dailydeal/src/override/ProductFullDetail/productFullDetail.js',
};
