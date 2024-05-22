// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

export const buildAssociatedViolationsKeys = (associatedViolations, violationsIDs) => {
  return Object.entries(associatedViolations).reduce((acc, [key, values]) => {
    if (!values.some(val => violationsIDs.includes(val))) return acc;

    return [...acc, key];
  }, []);
};
