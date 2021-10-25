import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import Carousel from '../Carousel/carousel'
import defaultClasses from './index.css';

const Home = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (<div className={classes.root}>
        <Carousel />
    </div>);
}

Home.propTypes = {
    classes: shape({ root: string })
};
Home.defaultProps = {};
export default Home;