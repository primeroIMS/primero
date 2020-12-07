/* eslint-disable import/prefer-default-export */

export const showId = flag => typeof flag !== "undefined" && (flag.get("name").match(/\*/g) || []).length === 7;
