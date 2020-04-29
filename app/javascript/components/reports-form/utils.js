import { TICK_FIELD } from "../form";
import { dataToJS } from "../../libs";
import { AGE_MAX } from "../../config";

export const dependantFields = formSections => {
  const data = dataToJS(formSections);

  const result = data[0].fields.reduce((acc, field) => {
    if (["name.en", "description.en"].includes(field.name)) {
      return acc;
    }

    return {
      ...acc,
      [field.name]: field.type === TICK_FIELD ? false : []
    };
  }, {});

  return result;
};

export const formatAgeRange = data =>
  data.join(", ").replace(/\../g, "-").replace(`-${AGE_MAX}`, "+");
