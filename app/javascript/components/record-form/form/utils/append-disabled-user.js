export default (users, userName) => {
  return userName && !users?.map(user => user.display_text).includes(userName)
    ? [...users, { id: userName, display_text: userName, disabled: true }]
    : users;
};
