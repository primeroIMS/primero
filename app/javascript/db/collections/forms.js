import DB from "../db";
import { normalizeFormData } from "../../schemas";

const convertToOrderedMap = entitiy =>
  entitiy.reduce((prev, current) => {
    const obj = prev;

    obj[current.id] = current;

    return obj;
  }, {});

const Forms = {
  find: async () => {
    const formSections = await DB.getAll("forms");
    const fields = await DB.getAll("fields");

    return {
      formSections: convertToOrderedMap(formSections),
      fields: convertToOrderedMap(fields)
    };
  },

  save: async ({ json }) => {
    const { data } = json;
    const { formSections, fields } = normalizeFormData(data).entities;

    await DB.bulkAdd("forms", formSections);
    await DB.bulkAdd("fields", fields);

    return {
      formSections,
      fields
    };
  }
};

export default Forms;
