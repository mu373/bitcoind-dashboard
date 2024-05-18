export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const decimalFloor = (value: number, base: number) => {
  return Math.floor(value * base) / base;
}

export const fetchWithRetry = async (url: string, retries: number = 5, delay: number = 1000): Promise<Response> => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response;
    } else if (response.status === 500 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    } else {
      throw error;
    }
  }
};
