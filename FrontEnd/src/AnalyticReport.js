const getAnalytics = (callback) => {
  if (callback && callback instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(callback);
      getFID(callback);
      getFCP(callback);
      getLCP(callback);
      getTTFB(callback);
    });
  }
};

export default getAnalytics;
