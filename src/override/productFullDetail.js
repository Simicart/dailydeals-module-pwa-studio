import React, { Fragment, Suspense } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';

import { Price } from '@magento/peregrine';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import Quantity from '@magento/venia-ui/lib/components/ProductQuantity';
import RichText from '@magento/venia-ui/lib/components/RichText';
import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.css';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql';
import { useProductDetails } from '../talons/useProductDetail';
import {
    DiscountLabel,
    DealPrice,
    CountDownTimer,
    calculateTimeLeft,
    ItemLeftSold
} from './dailyDeal.js';
import { useRef, useEffect, useState } from 'react';
const Options = React.lazy(() =>
    import('@magento/venia-ui/lib/components//ProductOptions')
);

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { product } = props;
    const labelData = props.product.mp_label_data;
    const talonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        product
    });
    const {
        detailsData,
        detailsLoading,
        deriveErrorMessage
    } = useProductDetails({ sku_product: props.product.sku });
    console.log(detailsData);
    var mp_daily_deal1,
        dateTo = null,
        timeLeft = null;

    if (detailsData) {
        detailsData.products.items.map(function(item) {
            if (item.mp_daily_deal) {
                mp_daily_deal1 = item.mp_daily_deal;
                if (item.mp_daily_deal.date_to) {
                    dateTo = item.mp_daily_deal.date_to;
                    timeLeft = calculateTimeLeft(dateTo);
                }
                return { mp_daily_deal1, timeLeft, dateTo };
            }
        });
    }
    console.log(mp_daily_deal1);
    console.log('timeLeft:' + timeLeft);

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        handleSetQuantity,
        isAddToCartDisabled,
        mediaGalleryEntries,
        productDetails,
        quantity
    } = talonProps;

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    'There was a problem with your cart. Please sign in again and try adding the item once more.'
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    'Could not add item to cart. Please check required options and try again.'
                )
            ]);
        }
    }

    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        {productDetails.name}
                    </h1>
                    {timeLeft > 0 ? (
                        <div >
                            <DealPrice
                                
                                dealPrice={mp_daily_deal1.deal_price}
                                regularPrice={productDetails.price.value}
                                currencyCode={productDetails.price.currency}
                            />
                        </div>
                    ) : (
                        <p className={classes.productPrice}>
                            <Price
                                currencyCode={productDetails.price.currency}
                                value={productDetails.price.value}
                            />
                        </p>
                    )}
                    {timeLeft > 0 ? (
                        <DiscountLabel
                            classes={classes}
                            discountLabel={mp_daily_deal1.discount_label}
                        />
                    ) : null}
                </section>
                <section className={classes.options} />
                <section className={classes.imageCarousel}>
                    <Carousel
                        images={mediaGalleryEntries}
                        labelData={labelData}
                    />
                </section>
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />

                <section className={classes.quantity}>
                    {timeLeft > 0 ? (
                        <ItemLeftSold
                            dealQty={mp_daily_deal1.deal_qty}
                            saleQty={mp_daily_deal1.sale_qty}
                        />
                    ) : null}
                    <br />
                    <h2 className={classes.quantityTitle}>Quantity</h2>
                    <Quantity
                        initialValue={quantity}
                        onValueChange={handleSetQuantity}
                        message={errors.get('quantity')}
                    />
                </section>
                {timeLeft > 0 ? (
                    <CountDownTimer
                        dateTo={mp_daily_deal1.date_to}
                        classes={classes}
                    />
                ) : null}

                <section className={classes.cartActions}>
                    <Button
                        priority="high"
                        onClick={handleAddToCart}
                        disabled={isAddToCartDisabled}
                    >
                        Add to Cart
                    </Button>
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        Product Description
                    </h2>
                    <RichText content={productDetails.description} />
                </section>
                <section className={classes.details}>
                    <h2 className={classes.detailsTitle}>SKU</h2>
                    <strong>{productDetails.sku}</strong>
                </section>
            </Form>
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string
    }),
    product: shape({
        __typename: string,
        id: number,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
