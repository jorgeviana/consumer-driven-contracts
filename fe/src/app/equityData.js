import 'whatwg-fetch';

export default async function equityData(port) {
    const isFake = process.env.NEXT_PUBLIC_USE_FAKE_DATA === 'true';
    if (isFake) {
        return await fetchAndTransform(port, fakeServerData);
    }
    else {
        return await fetchAndTransform(port);
    }
}


async function fetchAndTransform(port, fake) {
  const dataPoints = fake ? await fake() : await data(port);
  return dataPoints.map(p => transform(p));
}

async function data(port) {
  const data = await fetch(`http://localhost:${port}/api/equity/LON/TSCO`);
  const dataPoints = data.json();
  return dataPoints;
}

function transform({date, price}) {
    return {
        x: new Date(date),
        y: [price.open, price.high, price.low, price.close]
    };
}


async function fakeServerData() {
    await delay(900);
    return [
        {
            date: "2023, 11, 1",
            price: {open: 51.98, high: 56.30, low: 51.59, close: 53.84}
        },
        {
            date: "2023, 11, 2",
            price: {open: 53.66, high: 54.99, low: 51.35, close: 52.95},
        },
        {
            date: "2023, 11, 3",
            price: {open: 52.76, high: 57.35, low: 52.15, close: 55.42},
        },
        {
            date: "2023, 11, 4",
            price: {open: 55.27, high: 59.1, low: 53.91, close: 56.97},
        },
    ];
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
