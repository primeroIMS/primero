const setScreenSizeToMobile = mobile => {
  window.matchMedia = jest.fn().mockImplementation(query => {
    return {
      matches: mobile,
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn()
    };
  });
};

export default setScreenSizeToMobile;
