export function formatNumber(number: number): string {
  const numStr = number.toString();
  if (numStr === 'Infinity' || numStr === '-Infinity') {
    return 'Erro';
  }
  if (numStr === 'NaN') {
    return 'Erro';
  }

  const maxDigits = 12;

  if (Math.abs(number) >= 1e12) {
    return number.toExponential(6);
  }

  if (Number.isInteger(number)) {
    return number.toString();
  }

  const parts = numStr.split('.');
  if (parts[0].length >= maxDigits) {
    return number.toExponential(6);
  }

  const decimalPlaces = Math.min(maxDigits - parts[0].length - 1, 10);
  return number.toFixed(decimalPlaces).replace(/\.?0+$/, '');
}

export function getOperatorSymbol(operator: string | null): string {
  const symbols: { [key: string]: string } = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷',
  };
  return operator ? symbols[operator] || operator : '';
}