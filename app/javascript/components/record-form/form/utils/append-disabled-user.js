// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (users, userName) => {
  return userName && !users?.map(user => user.display_text).includes(userName)
    ? [...users, { id: userName, display_text: userName, disabled: true }]
    : users;
};
