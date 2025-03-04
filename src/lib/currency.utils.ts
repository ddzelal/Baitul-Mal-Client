import { CurrencyCode } from "@/interfaces/organization.interface";

interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

const DEFAULT_OPTIONS: FormatCurrencyOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  RSD: "sr-RS",
  EUR: "de-DE",
  USD: "en-US",
};

export const formatCurrency = (
  amount: number | string,
  currencyCode: CurrencyCode,
  options: FormatCurrencyOptions = DEFAULT_OPTIONS
): string => {
  const locale = CURRENCY_LOCALES[currencyCode];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
  }).format(Number(amount));
};

const EXCHANGE_API_URL = "https://api.exchangerate-api.com/v6/latest/EUR";

interface ExchangeRates {
  rates: {
    [key: string]: number;
  };
}

let cachedRates: ExchangeRates | null = null;
let lastFetchTime = 0;

async function fetchExchangeRates(): Promise<ExchangeRates> {
  if (cachedRates && Date.now() - lastFetchTime < 3600000) {
    return cachedRates;
  }

  const response = await fetch(EXCHANGE_API_URL);
  const data = (await response.json()) as ExchangeRates;
  cachedRates = data;
  lastFetchTime = Date.now();
  return data;
}

export async function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode = "RSD"
): Promise<number> {
  if (from === to) return amount;

  const rates = await fetchExchangeRates();
  const eurToRsd = rates.rates.RSD;

  if (from === "EUR") {
    return amount * eurToRsd;
  }

  return amount / eurToRsd;
}
