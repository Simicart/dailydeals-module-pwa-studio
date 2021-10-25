import React from 'react';
import { Price } from '@magento/peregrine';
import defaultClasses from './dailyDeal.css';
import { useRef, useEffect, useState } from 'react';
import { useStoreConfig } from '../../talons/useStoreConfig';

const classes = defaultClasses;
const convertDate = dateTo => {
    let s_year = dateTo.substring(0, 4);
    let s_month_num = dateTo.substring(5, 7);
    var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    function monthNumToName(monthnum) {
        return months[monthnum - 1] || '';
    }
    let s_month = monthNumToName(s_month_num);
    let s_day = dateTo.substring(8, 10);
    let s_hm = dateTo.substring(11, 16);
    const new_date = s_month
        .concat(' ', s_day)
        .concat(', ', s_year)
        .concat(' ', s_hm);
    new_date.toString();
    return new_date;
};

const calculateTimeLeft = dateTo => {
    const new_date = convertDate(dateTo);
    const countDownDate = new Date(new_date).getTime();
    const now = new Date().getTime();
    const totalSeconds = countDownDate - now;
    return totalSeconds;
};

const DealPrice = ({ dealPrice, regularPrice, currencyCode }) => {
    return (
        <span className={classes.productPriceOld}>
            <Price currencyCode={currencyCode} value={regularPrice} />
            <span className={classes.productPrices}>
                <b><Price currencyCode={currencyCode} value={dealPrice} /></b>
            </span>
        </span>
    );
};

const CountDownTimer = ({ dateTo }) => {
    const [adays, setDays] = useState('00');
    const [ahours, setHours] = useState('00');
    const [aminutes, setMinutes] = useState('00');
    const [aseconds, setSeconds] = useState('00');
    const {
        storeConfigData,
        storeConfigLoading,
        storeConfigError
    } = useStoreConfig();
    let interval = useRef();
    const startTimer = () => {
        interval = setInterval(() => {
            const totalSeconds = calculateTimeLeft(dateTo);
            let days = Math.floor(totalSeconds / (1000 * 60 * 60 * 24));
            let hours = Math.floor((totalSeconds % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
            let minutes = Math.floor((totalSeconds % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((totalSeconds % (1000 * 60)) / 1000);
            if (totalSeconds < 0) {
                clearInterval(interval.current);
            } else {
                setDays(days);
                setHours(hours);
                setMinutes(minutes);
                setSeconds(seconds);
            }
        }, 1000);
    };

    useEffect(() => {
        startTimer();
        return () => {
            clearInterval(interval.current);
        };
    }, []);

    if (storeConfigData) {
        const { mp_dailydeal_clock_style,
            mp_dailydeal_countdown_outer_color,
            mp_dailydeal_countdown_inner_color,
            mp_dailydeal_countdown_number_color,
            mp_dailydeal_countdown_text } = storeConfigData.storeConfig
        return (
            <div className={classes.p_20}>
                <div style={{ backgroundColor: `${mp_dailydeal_countdown_outer_color}` }} className={classes[`${mp_dailydeal_clock_style}`]}>
                    <span style={{ color: `${mp_dailydeal_countdown_number_color}` }} className={classes[`${mp_dailydeal_clock_style}` + `-txt1`]}>{adays}</span>
                    <span style={{ color: `${mp_dailydeal_countdown_text}` }} className={classes[`${mp_dailydeal_clock_style}` + `-txt2`]}>Days</span>
                </div>
                <div style={{ backgroundColor: `${mp_dailydeal_countdown_outer_color}` }} className={classes[`${mp_dailydeal_clock_style}`]}>
                    <span style={{ color: `${mp_dailydeal_countdown_number_color}` }} className={classes[`${mp_dailydeal_clock_style}` + `-txt1`]}>{ahours}</span>
                    <span style={{ color: `${mp_dailydeal_countdown_text}` }} className={classes[`${mp_dailydeal_clock_style}` + `-txt2`]}>Hours</span>
                </div>
                <div style={{ backgroundColor: `${mp_dailydeal_countdown_outer_color}` }} className={classes[`${mp_dailydeal_clock_style}`]}>
                    <span style={{ color: `${mp_dailydeal_countdown_number_color}` }} className={classes[`${mp_dailydeal_clock_style}` + `-txt1`]}>{aminutes}</span>
                    <span style={{ color: `${mp_dailydeal_countdown_text}` }} className={classes[`${mp_dailydeal_clock_style}` + `-txt2`]}>Minutes</span>
                </div>
                <div style={{ backgroundColor: `${mp_dailydeal_countdown_outer_color}` }} className={classes[`${mp_dailydeal_clock_style}`]}>
                    <span style={{ color: `${mp_dailydeal_countdown_number_color}` }} className={classes[`${mp_dailydeal_clock_style}` + `-txt1`]}>{aseconds}</span>
                    <span style={{ color: `${mp_dailydeal_countdown_text}` }} className={classes[`${mp_dailydeal_clock_style}` + `-txt2`]}>Seconds</span>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }

};

const DiscountLabel = ({ discountLabel }) => {
    return (
        <div className={classes.price}>
            <div>
                <span className={classes.underprice}>
                    <span>{discountLabel}</span>
                </span>
            </div>
            <br></br>
            <p>Limited Time Remaining!</p>
        </div>
    );
};

const ItemLeftSold = ({ saleQty, dealQty }) => {
    let itemLeft = Number(dealQty) - Number(saleQty);
    return (
        <div>
            <hr ></hr>
            <span> <b>{itemLeft}</b> item(s) left </span>
            <span className={classes.vl} />
            <span> <b>{saleQty}</b> item(s) sold </span>
            <hr ></hr>
        </div>
    );
};
export {
    CountDownTimer,
    DiscountLabel,
    DealPrice,
    convertDate,
    calculateTimeLeft,
    ItemLeftSold
};