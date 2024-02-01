export const getLocationQueryParams = (): AnyObject =>
  Object.fromEntries(
    location.search
      .replace('?', '')
      .split('&')
      .filter(Boolean)
      .map((str) => {
        const [name, value] = str.split('=');
        return [name, decodeURIComponent(value)];
      }),
  );
