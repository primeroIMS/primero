export default (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];
