import DB from "../db";

const Records = {
  find: async ({ collection, recordType, db }) => {
    const { id } = db;

    return {
      data: id ? await DB.getRecord(collection, id) : await DB.getAllFromIndex(collection, "type", recordType)
    };
  },

  save: async ({ collection, json, recordType }) => {
    const { data, metadata } = json;
    const dataKeys = Object.keys(data);
    const jsonData = dataKeys.length === 1 && dataKeys.includes("record") ? data.record : data;
    const dataIsArray = Array.isArray(jsonData);
    const recordData = Array.isArray(jsonData) ? jsonData : { ...jsonData, complete: true };

    if (dataIsArray) {
      await DB.bulkAdd(collection, recordData, {
        index: "type",
        value: recordType
      });
    } else {
      await DB.put(collection, recordData, null, {
        index: "type",
        value: recordType
      });
    }

    const recordDB = jsonData.id && !dataIsArray && (await DB.getRecord(collection, jsonData.id));

    return {
      data: recordDB || recordData,
      ...(dataIsArray && { metadata })
    };
  },

  onTransaction: async ({ collection, db, transactionCallback }) => {
    const result = await DB.onTransaction(collection, db.mode, transactionCallback);

    return { data: result };
  }
};

export default Records;
