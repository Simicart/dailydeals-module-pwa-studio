import React, { Fragment, Suspense } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';

import { Price } from '@magento/peregrine';
import defaultClasses from './dailyDeal.css';
import { useRef, useEffect, useState } from 'react';
const Options = React.lazy(() => import('@magento/venia-ui/lib/components//ProductOptions'));

const classes = defaultClasses

const convertDate = (dateTo) => {
    let s_year = dateTo.substring(0,4);
    let s_month_num = dateTo.substring(5,7);
    var months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May',
        'Jun', 'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'
        ];
        
    function monthNumToName(monthnum) {
        return months[monthnum - 1] || '';
    }
    let s_month = monthNumToName(s_month_num);
    let s_day = dateTo.substring(8,10)
    let s_hm = dateTo.substring(11,16);
    const new_date = ((s_month.concat(' ', s_day)).concat(', ', s_year)).concat(' ', s_hm);
    new_date.toString();
    return new_date;
}
const calculateTimeLeft = (dateTo) =>{
    const new_date = convertDate(dateTo);
    const countDownDate = new Date(new_date).getTime();
    const now = new Date().getTime();
    const totalSeconds = countDownDate - now;
    return totalSeconds;
}
const DealPrice = ({dealPrice, regularPrice, currencyCode}) => {
    return (
        <span className={classes.productPriceOld}>
            <Price
                currencyCode={currencyCode}
                value={regularPrice}
            />
            <span className={classes.productPrices}>${dealPrice}.00</span>    
        </span>
    )
}


const CountDownTimer = ({dateTo}) => {
    const [adays, setDays] = useState('00');
    const [ahours, setHours] = useState('00');
    const [aminutes, setMinutes] = useState('00');
    const [aseconds, setSeconds] = useState('00');
    const new_date = convertDate(dateTo);
    //const test = 'Dec 30, 2020 10:57'
    let interval = useRef();
    const startTimer = () =>{
        const countDownDate = new Date (new_date).getTime();
        interval = setInterval(() =>{
            const now = new Date().getTime();
            const totalSeconds = countDownDate - now;
            
            let days = Math.floor(totalSeconds / (1000* 60 * 60 * 24));
            let hours =  Math.floor((totalSeconds / ( 1000*60 * 60)) % 24);
            let minutes =  Math.floor((totalSeconds /1000 / 60) % 60);
            let seconds = Math.floor((totalSeconds/1000) % 60);
            if (totalSeconds < 0){
                clearInterval(interval.current);
            }
            else{
                setDays(days);
                setHours(hours);
                setMinutes(minutes);
                setSeconds(seconds);
            }
        }, 1000);
    }

    useEffect(() => {
        startTimer();
        return () => {
            clearInterval(interval.current)
        }
    }, [])
    
    return (
        
        <div className={classes.row}>
            <div className={classes.col-4}>
                <span className={classes.deal_style_4}>
                    <span >{adays}</span>
                    <div>Days</div>
                </span>
            </div>
            <div className={classes.col-4}>
                <div className={classes.deal_style_4}>
                    <span >{ahours}</span>
                    <div>Hours</div>
                </div>
            </div>
            <div className={classes.col-4}>
                <span className={classes.deal_style_4}>
                    <span >{aminutes}</span>
                    <div>Minutes</div>
                </span>
            </div>
            <div className={classes.col-4}>
                <div className={classes.deal_style_4}>
                    <span >{aseconds}</span>
                    <div>Seconds</div>
                </div>
            </div>
    
            
        </div>
    )
}

const DiscountLabel = ({discountLabel}) => {
    return(
    <div className={classes.price}>                
        <div>
            <span className={classes.underprice}>
                <span>{discountLabel}</span>
            </span>
        </div>
        <p>Limited Time Remaining</p>
    </div>
    )
}
export {CountDownTimer, DiscountLabel, DealPrice, convertDate, calculateTimeLeft}