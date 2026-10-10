// Utilidades de conversión y formato de moneda. Los precios de la tienda se
// guardan en euros y cada divisa aplica su tipo de cambio y su formato local.

export const CURRENCIES = {
  EUR: { code: "EUR", locale: "es-ES", label: "Euro (€)", rate: 1, fractionDigits: 2 },
  USD: { code: "USD", locale: "en-US", label: "Dólar estadounidense ($)", rate: 1.1551, fractionDigits: 2 },
  GBP: { code: "GBP", locale: "en-GB", label: "Libra esterlina (£)", rate: 0.85598, fractionDigits: 2 },
  MXN: { code: "MXN", locale: "es-MX", label: "Peso mexicano ($)", rate: 19.72, fractionDigits: 2 },
  COP: { code: "COP", locale: "es-CO", label: "Peso colombiano ($)", rate: 3732.98, fractionDigits: 0 },
  CLP: { code: "CLP", locale: "es-CL", label: "Peso chileno ($)", rate: 1082.834, fractionDigits: 0 },
  ARS: { code: "ARS", locale: "es-AR", label: "Peso argentino ($)", rate: 1749.2566, fractionDigits: 2 },
  BRL: { code: "BRL", locale: "pt-BR", label: "Real brasileño (R$)", rate: 5.9564, fractionDigits: 2 },
  JPY: { code: "JPY", locale: "ja-JP", label: "Yen japonés (¥)", rate: 178.52, fractionDigits: 0 },
  CHF: { code: "CHF", locale: "de-CH", label: "Franco suizo (CHF)", rate: 0.9431, fractionDigits: 2 },
};

// Lista lista para pintar en el selector de moneda de la cuenta.
export const currencyOptions = Object.values(CURRENCIES);

// Convierte un importe en euros a la divisa indicada y lo formatea con el
// locale correspondiente (símbolo, separador de miles y decimales).
export const currency = (value, currencyCode = "EUR") => {
  const target = CURRENCIES[currencyCode] ?? CURRENCIES.EUR;
  const converted = value * target.rate;
  return converted.toLocaleString(target.locale, {
    style: "currency",
    currency: target.code,
    minimumFractionDigits: target.fractionDigits,
    maximumFractionDigits: target.fractionDigits,
  });
};
