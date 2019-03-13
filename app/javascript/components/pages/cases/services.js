import { buildUrl } from "libs";

export const getCases = async options => {
  const path = buildUrl("GET", "cases", options);

  const response = await window.fetch(path.input, path.init);

  if (!response.ok) {
    throw new Error();
  }

  if (response.status === 404) {
    return {};
  }

  const json = await response.json();
  return json;
};

export const getCase = () => {};
