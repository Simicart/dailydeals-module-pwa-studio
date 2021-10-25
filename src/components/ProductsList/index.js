import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './index.css';
import CategoryList from '../../override/CategoryList/categoryList';


const ProductsList = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (<div className={classes.root}>
        <CategoryList />
    </div>);
}

ProductsList.propTypes = {
    classes: shape({ root: string })
};
ProductsList.defaultProps = {};
export default ProductsList;