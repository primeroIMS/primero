const tick = () =>
  new Promise(resolve => {
    setTimeout(resolve, 100);
  });

export default tick;
