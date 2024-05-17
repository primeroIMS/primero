// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const tick = () =>
  new Promise(resolve => {
    setTimeout(resolve, 100);
  });

export default tick;
