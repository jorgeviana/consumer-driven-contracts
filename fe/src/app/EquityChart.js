'use client'

import {useEffect, useState} from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), {ssr: false});
import equityData from "./equityData";

const options = {
    title: {
        text: 'Stock Price Data',
        align: 'left',
    },
    xaxis: {
        type: 'datetime',
    },
    tooltip: {
        theme: "dark",
    },
};

export default function EquityChart({fetchDataAction}) {

    const [axisData, setAxisData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCommand = fetchDataAction ? fetchDataAction : equityData;

        async function fetchData() {
            return await fetchCommand();
        }

        fetchData()
            .then(setAxisData)
            .catch(setError);
    }, []);

    if (error) return <>Error loading data from server!</>

    return <>
        {axisData
            ? <Chart options={options} series={[{data: axisData}]} type="candlestick" width="600"/>
            : <>Loading...</>
        }
    </>
}
