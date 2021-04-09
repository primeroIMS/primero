import { get } from "../components/form/utils";

const buildFieldMap = (record, fieldMap) => {
  return fieldMap.reduce((prev, { source, target }) => {
    return { ...prev, [target]: get(record, source) };
  }, {});
};

export default buildFieldMap;
