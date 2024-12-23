// Set your API key here
const apiKey = '5bf267633d8339796d37c2f8';

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const convertButton = document.getElementById('convert-btn');
const conversionResult = document.getElementById('conversion-result');
const conversionRate = document.getElementById('conversion-rate');
const historyList = document.getElementById('history-list');

let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

const currencies = [
    'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'INR', 'CNY', 'CHF', 'NZD', 'SEK', 'MXN', 'SGD', 'PKR'
];

function populateCurrencies() {
    currencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        fromCurrencySelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        toCurrencySelect.appendChild(optionTo);
    });
}

async function getExchangeRate(fromCurrency, toCurrency) {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.conversion_rates[toCurrency];
}

async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    const rate = await getExchangeRate(fromCurrency, toCurrency);
    const result = (amount * rate).toFixed(2);

    conversionResult.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    conversionRate.textContent = `Conversion Rate: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;

    addToHistory(amount, fromCurrency, result, toCurrency, rate);
}

function addToHistory(amount, fromCurrency, result, toCurrency, rate) {
    const historyItem = {
        amount,
        fromCurrency,
        result,
        toCurrency,
        rate,
        timestamp: new Date().toLocaleString()
    };

    conversionHistory.push(historyItem);
    if (conversionHistory.length > 5) {
        conversionHistory.shift(); 
    }

    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));

    updateHistoryList();
}

function updateHistoryList() {
    historyList.innerHTML = '';
    conversionHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.amount} ${item.fromCurrency} = ${item.result} ${item.toCurrency}<br>
            Rate: ${item.rate} | Date: ${item.timestamp}
        `;
        historyList.appendChild(listItem);
    });
}

populateCurrencies();
updateHistoryList();

convertButton.addEventListener('click', convertCurrency);
