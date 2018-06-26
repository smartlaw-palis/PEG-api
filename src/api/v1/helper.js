

import market from './services/market';
let marketService = market.marketService;

let SECONDS_IN_MILLIS = 1000;
let MINUTES_IN_MILLIS = 60 * SECONDS_IN_MILLIS;
let FREQUENCY_IN_MILLIS = 1 * MINUTES_IN_MILLIS;

let marketData = {};

function fetchMarketDetails() {
  marketService.details()
    .then(result => {
        marketData = result;
    })
  setTimeout(() => { fetchMarketDetails(); }, FREQUENCY_IN_MILLIS)
}
fetchMarketDetails();

export function marketDetails() {
  return new Promise((resolve, reject) => {
    resolve(marketData);
  })
}