// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { useApp } from "../application";

export const useFnWhenConnected = connectedFn => {
  const { online } = useApp();

  if (connectedFn && online) {
    return () => connectedFn();
  }

  return () => {};
};
