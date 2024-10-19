import Moment from 'moment';

export const unixTimestamp = (date: Date | null): number | null => {
  if (!date) return null;
  return Moment(date).unix();
};

export const dateTimestamp =(date: Date | null): string | null => {
  if (!date) return null;
  return Moment(date).format('YYYYMMDD');
};

export const normalizeWhitespace = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
}

export const testCount = (base: number, exponent: number, type?: string): number => {
  if (type === 'batch') {
    return base * exponent;
  } else if (base === 1) {
    return exponent;
  }
  return (Math.pow(base, exponent) - 1) / (base - 1);
};

export const paddedNumber = (num: number, length = 2): string => {
  return num.toString().padStart(length, '0');
}

export const repeatString = (str: string, count: number): string => str.repeat(count);

export const arrayToHash = (response: [number, ...Array<string | string[]>]): Record<string, string>[] => {
  const results: Record<string, string>[] = [];
  let key: string | undefined;
  for (let i = 1; i < response.length; i++) { // ignore count
    const row = response[i];
    const result: Record<string, string> = {};
    if (Array.isArray(row)) { // Check if row is an array
      for (let j = 0; j < row.length; j += 2) {
        const key = row[j];
        const value = row[j + 1];
        result[key] = value;
      }
      if (key) {
        result.$ = key;
      }
      results.push(result);
      key = undefined;
    } else {
      key = row as string;
    }
  }
  return results;
};

/**
 * Safely serialize order data for storage in Redis
 * @param obj
 */
export const safeData = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce((acc, key: string) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      acc[key as string] = obj[key].toString();
    }
    return acc;
  }, {} as Record<string, any>);
};
