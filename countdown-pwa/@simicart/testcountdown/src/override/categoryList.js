import React from 'react';
import { string, number, shape } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import defaultClasses from '@magento/venia-ui/lib/components/CategoryList/categoryList.css';
import CategoryTile from '@magento/venia-ui/lib/components/CategoryList/categoryTile';
import categoryListQuery from '@magento/venia-ui/lib/queries/getCategoryList.graphql';
import { useCategoryList } from '@magento/peregrine/lib/talons/CategoryList/useCategoryList';
import {useProductList} from '@simicart/testcountdown/src/talons/useProductList';
import {useProductDetails} from '@simicart/testcountdown/src/talons/useProductDetail'
import Gallery from '@magento/venia-ui/lib/components/Gallery';
import {convertDate, calculateTimeLeft} from './dailyDeal'
// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapCategory = categoryItem => {
    const { items } = categoryItem.productImagePreview;
    return {
        ...categoryItem,
        productImagePreview: {
            items: items.map(item => {
                const { small_image } = item;
                return {
                    ...item,
                    small_image:
                        typeof small_image === 'object'
                            ? small_image.url
                            : small_image
                };
            })
        }
    };
};

const CategoryList = props => {
    const {productListData,
        productListLoading,
        derivedErrorMessage} = useProductList();
    const skuDatas = [];
    if (productListData) {
        var len = productListData.MpDailyDeals.items.length;
        for (var i = 0; i < len; i++){
            let skuData = productListData.MpDailyDeals.items[i].product_sku
            let dateTo = productListData.MpDailyDeals.items[i].date_to
            const totalSeconds = calculateTimeLeft(dateTo);
            if (totalSeconds > 0){
                skuDatas.push(skuData);
            }
        }
        console.log(skuDatas);
    }
    const {detailsData,
        detailsLoading,
        deriveErrorMessage} = useProductDetails({sku_product: skuDatas});
    console.log(detailsData)
    
    const { id, title } = props;
    const talonProps = useCategoryList({
        query: categoryListQuery,
        id
    });

    const { childCategories, error, loading } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const header = title ? (
        <div className={classes.header}>
            <h2 className={classes.title}>
                <span>{title}</span>
            </h2>
        </div>
    ) : null;

    let child;
    if (error) {
        child = (
            <div className={classes.fetchError}>
                Data Fetch Error: <pre>{error.message}</pre>
            </div>
        );
    }
    if (loading || !childCategories) {
        child = fullPageLoadingIndicator;
    } else if (childCategories.length === 0) {
        child = (
            <div className={classes.noResults}>No child categories found.</div>
        );
    } else {
        child = (
            <div className={classes.content}>
                {childCategories.map(item => (
                    <CategoryTile item={mapCategory(item)} key={item.url_key} />
                ))}
            </div>
        );
    }
    return (
        <div className={classes.root}>
            {header}
            {child}
            {detailsData ? (
                <Gallery items={detailsData.products.items}/>
            ):(null)}
        </div>
    );
};

CategoryList.propTypes = {
    id: number,
    title: string,
    classes: shape({
        root: string,
        header: string,
        content: string
    })
};

export default CategoryList;
