import { List } from "immutable";

const paramQueryString = (key, value) => {
  if (List.isList(value)) {
    return value.reduce((prev, elem, index) => {
      if (!prev) {
        return `${key}[${index}]=${elem}`;
      }

      return `${prev}&${key}[${index}]=${elem}`;
    }, "");
  }

  return `${key}=${value}`;
};

export default filters =>
  filters.entrySeq().reduce((acc, [key, value]) => {
    const param = paramQueryString(key, value);

    if (!acc) {
      return `${acc}${param}`;
    }

    return `${acc}&${param}`;
  }, "");
