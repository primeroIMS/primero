import { Set } from "immutable";

export const keyIn = (...keys) => {
  const keySet = Set(keys);
  return (v, k) => {
    return keySet.has(k);
  };
};
