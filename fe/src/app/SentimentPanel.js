'use client'

import {useEffect, useState} from 'react';
import sentimentData from "./sentimentData";

export default function SentimentPanel({exchangeCode, equityCode}) {

    const [sentiments, setSentiments] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {

      if (exchangeCode != 'NDX') {
        setSentiments([]);
        setError(null);
        return;
      }

        const fetchCommand = sentimentData;

        async function fetchData() {
            return await fetchCommand();
        }

        fetchData()
            .then(setSentiments)
            .then(d => setError(null))
            .catch(setError);
    }, [exchangeCode]);

    if (error) return <>Error loading data from server!</>

    return <>
        {sentiments
            ? sentiments.map(
                s =>
                    <div key={s.title + s.url}>
                        <a className="underline" target="_blank" href={s.url}>{s.title}</a>
                    </div>
            )
            : <>Loading...</>
        }
    </>
}
