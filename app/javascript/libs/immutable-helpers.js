import { Set } from "immutable";

export default (...keys) => {
  const keySet = Set(keys);

  return (v, k) => keySet.has(k);
};
