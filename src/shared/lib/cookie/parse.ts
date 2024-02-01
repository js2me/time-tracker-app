export const parse = () => {
  const cookiesString = document.cookie;
  return cookiesString
    .split(';')
    .map(function (cookieString) {
      return cookieString.trim().split('=');
    })
    .reduce<AnyObject>(function (acc, curr) {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});
};
