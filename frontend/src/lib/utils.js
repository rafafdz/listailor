import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function toCurrency(value, options = {}) {
  if (!Number(value) && value !== 0) {
    return value;
  }

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    ...options,
  });

  return formatter.format(value);
}

export function computeListScore(list) {
  return list.items.reduce((acc, item) => acc + item.score, 0) / list.items.length;
}

export function displayScore(score) {
  return score * 10;
}
