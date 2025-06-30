'use client'

import {useEffect, useState} from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), {ssr: false});
import equityData from "./equityData.ts";
import {useUser} from '../context/UserContext';

const options = {
    title: {
        text: 'Equity Price Data',
        align: 'left',
    },
    xaxis: {
        type: 'datetime',
    },
    theme: {
        mode: 'dark'
    },
};

export default function EquityChart({fetchDataAction, port, exchangeCode, equityCode}) {

    const [axisData, setAxisData] = useState(null)
    const [error, setError] = useState(null)

    const exchange= exchangeCode ? exchangeCode : "LON";
    const equity= equityCode? equityCode : "TSCO";

    const { user } = useUser();

    useEffect(() => {
        const fetchCommand = fetchDataAction ? fetchDataAction : equityData;

        async function fetchData() {
            return await fetchCommand(port ? port : 8080, exchange, equity, user.token);
        }

        fetchData()
            .then(setAxisData)
            .catch(setError);
    }, []);

    if (error) return <>Error loading data from server!</>

    if (axisData && axisData.length == 0) return <div>empty data</div>;

    return <>
        {axisData
            ? <Chart options={options} series={[{data: axisData}]} type="candlestick" width="600"/>
            : <>Loading...</>
        }
    </>
}
