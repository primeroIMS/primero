export default (name, id) => {
  if (id) {
    return `${name}-${id}`;
  }

  return name;
};
