/* eslint-disable import/prefer-default-export */

export const buildErrorMessages = data => data?.map(error => error.get("detail")).join(", ");
