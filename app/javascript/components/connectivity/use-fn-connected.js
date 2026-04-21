/* eslint-disable import/prefer-default-export */
import { useApp } from "../application";

export const useFnWhenConnected = connectedFn => {
  const { online } = useApp();

  if (connectedFn && online) {
    return () => connectedFn();
  }

  return () => {};
};
