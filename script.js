document.addEventListener("DOMContentLoaded", async () => {
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const convertedAmount = document.getElementById("convertedAmount");
    const exchangeRateDisplay = document.getElementById("exchangeRate");
    const convertButton = document.getElementById("convert");
    const fromCurrencySearch = document.getElementById("fromCurrencySearch");
    const toCurrencySearch = document.getElementById("toCurrencySearch");
    const switchButton = document.getElementById("switchButton");

    const API_URL = "https://api.exchangerate-api.com/v4/latest/";

    const currencyList = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'NZD', 'ALL'];
    const currencySymbols = {
        "USD": "$", "EUR": "€ ", "GBP": "£", "JPY": "¥", "CAD": "C$", 
        "AUD": "A$", "CHF": "CHF", "CNY": "¥", "INR": "₹", "NZD": "NZ$", "ALL": "Lekë"
    };

    function populateCurrencies(selectElement) {
        selectElement.innerHTML = "";
        currencyList.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = `${currency} (${currencySymbols[currency]})`;
            selectElement.appendChild(option);
        });
    }

    populateCurrencies(fromCurrency);
    populateCurrencies(toCurrency);

    function filterCurrencies(searchInput, currencySelect) {
        searchInput.addEventListener("input", () => {
            const filter = searchInput.value.toUpperCase();
            Array.from(currencySelect.options).forEach(option => {
                option.style.display = option.textContent.toUpperCase().includes(filter) ? "" : "none";
            });
        });
    }

    filterCurrencies(fromCurrencySearch, fromCurrency);
    filterCurrencies(toCurrencySearch, toCurrency);

    switchButton.addEventListener("click", () => {
        [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
        convertButton.click();
    });

    convertButton.addEventListener("click", async () => {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}${from}`);
            if (!response.ok) throw new Error("API error");

            const data = await response.json();
            const rate = data.rates[to];

            if (!rate) {
                alert("Exchange rate not available.");
                return;
            }

            convertedAmount.value = `${currencySymbols[to]} ${(amount * rate).toFixed(2)}`;
            exchangeRateDisplay.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        } catch (error) {
            alert("Error fetching exchange rate. Please try again later.");
        }
    });
});