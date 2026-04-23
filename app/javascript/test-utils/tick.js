const tick = (delay = 100) =>
  new Promise(resolve => {
    setTimeout(resolve, delay);
  });

export default tick;
