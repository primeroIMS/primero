// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const getToken = () => {
  return localStorage.getItem("cachedIdToken");
};

export default getToken;
