// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const tick = (delay = 100) =>
  new Promise(resolve => {
    setTimeout(resolve, delay);
  });

export default tick;
