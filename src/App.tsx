import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import './ConvertMoneyForm.css';


interface Account {
  id: string;
  name: string;
  currency: string;
  balance: number;
}

interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
}

const mockAccounts: Account[] = [
  { id: '1', name: 'USD Account', currency: 'USD', balance: 1000 },
  { id: '2', name: 'EUR Account', currency: 'EUR', balance: 2000 },
  { id: '3', name: 'GBP Account', currency: 'GBP', balance: 3000 },
];

const mockExchangeRates: { [key: string]: number } = {
  'USD-EUR': 0.85,
  'USD-GBP': 0.75,
  'EUR-USD': 1.18,
  'EUR-GBP': 0.88,
  'GBP-USD': 1.33,
  'GBP-EUR': 1.14,
};

const fetchExchangeRates = (): Promise<{ [key: string]: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockExchangeRates);
    }, 1000);
  });
};

const simulateConversion = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: { [key: string]: number }
): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rate = exchangeRates[`${fromCurrency}-${toCurrency}`] || 1;
      const convertedAmount = amount * rate;
      resolve({
        fromAmount: amount,
        toAmount: convertedAmount,
        rate,
        fee: amount * 0.01, 
      });
    }, 1000);
  });
};

const App: React.FC = () => {
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAccounts(mockAccounts);
      setLoading(false);
    }, 1000);

    const fetchRates = async () => {
      setLoading(true);
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch {
        setError('Failed to fetch exchange rates');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const accountOptions = useMemo(() => {
    return accounts.map(account => (
      <option key={account.id} value={account.id}>
        {account.name} ({account.currency})
      </option>
    ));
  }, [accounts]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeoutId = window.setTimeout(() => {
      handleConversion();
    }, 500);

    setDebounceTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [fromAccount, toAccount, amount]);

  const handleConversion = async () => {
    if (!fromAccount || !toAccount || !amount) return;

    const fromAccountDetails = accounts.find(acc => acc.id === fromAccount);
    const toAccountDetails = accounts.find(acc => acc.id === toAccount);

    if (!fromAccountDetails || !toAccountDetails) {
      setError('Invalid account selected.');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Invalid amount.');
      return;
    }

    if (amountValue > fromAccountDetails.balance) {
      setError('Amount exceeds balance.');
      return;
    }

    try {
      const result = await simulateConversion(
        amountValue,
        fromAccountDetails.currency,
        toAccountDetails.currency,
        exchangeRates
      );
      setConversionResult(result);
      setError(null);
    } catch {
      setError('Conversion failed.');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="convert-money-form">
      <div className="form-group">
        <label htmlFor="fromAccount">From Account:</label>
        <select
          id="fromAccount"
          value={fromAccount}
          onChange={(e) => setFromAccount(e.target.value)}
          disabled={loading}
        >
          <option value="">Select account</option>
          {accountOptions}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="toAccount">To Account:</label>
        <select
          id="toAccount"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          disabled={loading}
        >
          <option value="">Select account</option>
          {accountOptions}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          min="0"
          step="0.01"
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {conversionResult && (
        <div className="conversion-result">
          <p>From Amount: {conversionResult.fromAmount}</p>
          <p>To Amount: {conversionResult.toAmount}</p>
          <p>Exchange Rate: {conversionResult.rate}</p>
          <p>Fee: {conversionResult.fee}</p>
        </div>
      )}

      <button type="submit" className="submit-button" disabled={loading}>
        Convert
      </button>
    </form>
  );
};

export default App;
