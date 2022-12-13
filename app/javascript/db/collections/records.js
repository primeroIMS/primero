import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import merge from "deepmerge";

import DB from "../db";
import subformAwareMerge from "../utils/subform-aware-merge";
import getCreatedAt from "../utils/get-created-at";
import { QUICK_SEARCH_FIELDS } from "../../config";

const sortData = data => data.sort((record1, record2) => getCreatedAt(record2) - getCreatedAt(record1));

const Records = {
  find: async ({ collection, recordType, db, json }) => {
    const { id } = db;
    const params = json?.api?.params;

    if (params.query) {
      const results = await DB.searchIndex(collection, params.query, recordType);

      return { data: results };
    }

    const data = id ? await DB.getRecord(collection, id) : await DB.getAllFromIndex(collection, "type", recordType);

    return {
      data: Array.isArray(data) ? sortData(data) : data
    };
  },

  updateCaseIncidents: async (data, online) => {
    const { incident_case_id: caseID } = data;
    const caseRecord = await Records.find({ collection: "records", db: { id: caseID } });

    if (isEmpty(caseRecord?.data)) {
      return;
    }
    const { id, ...incidentData } = data;
    // eslint-disable-next-line camelcase
    const caseIncidentDetails = caseRecord?.data?.incident_details;
    const incidentDetails = [...(caseIncidentDetails || [])];
    const incidentIndex = incidentDetails.findIndex(incident => incident.unique_id === id);
    const parsedIncident = { unique_id: id, ...incidentData };

    if (incidentIndex === -1) {
      incidentDetails.push(parsedIncident);
    } else {
      incidentDetails[incidentIndex] = merge(incidentDetails[incidentIndex], parsedIncident, {
        arrayMerge: subformAwareMerge
      });
    }

    await Records.save({
      collection: "records",
      recordType: "cases",
      json: { data: { ...caseRecord.data, incident_details: compact(incidentDetails) } },
      online
    });
  },

  dataMarkedComplete(data, markComplete = false, online = false) {
    if (Array.isArray(data)) {
      return markComplete && online ? data.map(record => ({ ...record, complete: true })) : data;
    }

    return markComplete && online ? { ...data, complete: true } : data;
  },

  dataTokenizedTerms(data) {
    if (Array.isArray(data)) {
      return data.map(record => this.dataTokenizedTerms(record));
    }

    return {
      ...data,
      terms: QUICK_SEARCH_FIELDS.reduce((acc, quickField) => {
        const value = data[quickField];

        if (!isNil(value)) {
          return acc.concat(data[quickField]);
        }

        return acc;
      }, [])
    };
  },

  save: async ({ collection, json, recordType, online = false, params }) => {
    const { data, metadata } = json;
    const { fields, id_search: idSearch } = params || {};
    const dataKeys = Object.keys(data);
    const jsonData = dataKeys.length === 1 && dataKeys.includes("record") ? data.record : data;
    const dataIsArray = Array.isArray(jsonData);
    const recordData = Records.dataTokenizedTerms(
      Records.dataMarkedComplete(jsonData, !(fields === "short" || idSearch), online)
    );

    // eslint-disable-next-line camelcase
    if (data?.incident_case_id && recordType === "incidents") {
      await Records.updateCaseIncidents(data, online);
    }

    const records = await DB.save(dataIsArray, {
      store: collection,
      data: recordData,
      queryIndex: {
        index: "type",
        value: recordType
      }
    });

    return {
      data: records,
      ...(dataIsArray && { metadata })
    };
  },

  onTransaction: async ({ collection, db, transactionCallback }) => {
    const result = await DB.onTransaction(collection, db.mode, transactionCallback);

    return { data: result };
  }
};

export default Records;
