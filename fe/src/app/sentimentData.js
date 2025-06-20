export default function sentimentData() {
    // TODO add support for env vars with cross-env
    const isFake = process.env.NEXT_PUBLIC_USE_FAKE_DATA === 'true';
    if (isFake) {
        return fetchFakeData();
    }
    else {
        // in tests this branch is selected!
        // throw new Error('Not yet implemented!');
        return fetchFakeData();
    }
}

async function fetchFakeData() {
    await delay(300);
    return fetchFromServer();
}

function fetchFromServer() {
    return [
        {
            title: "Members of Congress Are Pouring Millions Into These 7 Surprising Stocks",
            url: "https://www.fool.com/investing/2025/06/17/members-of-congress-are-pouring-millions-into-thes/",
        },
        {
            title: "Here's How Many Shares of Realty Income Stock You Should Own to Get $500 in Yearly Dividends",
            url: "https://www.fool.com/investing/2025/06/16/heres-shares-realty-income-stock-own-500/",
        },
    ];
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
