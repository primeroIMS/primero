import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import merge from "deepmerge";
import { isImmutable } from "immutable";
import { parseISO } from "date-fns";

import DB from "../db";
import subformAwareMerge from "../utils/subform-aware-merge";
import getCreatedAt from "../utils/get-created-at";
import { QUICK_SEARCH_FIELDS, DATE_SORTABLE_FIELDS } from "../../config";
import { reduceMapToObject, hasApiDateFormat } from "../../libs";

const sortData = data => data.sort((record1, record2) => getCreatedAt(record2) - getCreatedAt(record1));

const Records = {
  find: async ({ collection, recordType, db, json }) => {
    const { id } = db;

    const params =
      json?.api?.params && isImmutable(json?.api?.params) ? reduceMapToObject(json.api.params) : json?.api?.params;

    if (params.query) {
      const results = await DB.searchIndex(collection, params.query, recordType);
      const data = params.order_by ? sortBy(results, [params.order_by]) : sortData(results);

      return { data: params.order === "desc" ? reverse(data) : data };
    }

    if (params.page && params.per) {
      const offset = (params.page - 1) * params.per;

      const total = await DB.count(collection, "type", recordType);

      const data = await DB.slice(collection, {
        orderBy: params.order_by || "created_at",
        orderDir: params.order || "prev",
        offset,
        limit: params.per,
        recordType,
        total
      });

      return { data, metadata: { per: params.per, page: params.page, total } };
    }

    const data = id ? await DB.getRecord(collection, id) : await DB.getAllFromIndex(collection, "type", recordType);

    return { data: Array.isArray(data) ? sortData(data) : data };
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

  dataTokenizedTerms(data, recordType) {
    if (Array.isArray(data)) {
      return data.map(record => this.dataTokenizedTerms(record, recordType));
    }

    const sortableDateFields = DATE_SORTABLE_FIELDS.reduce((acc, field) => {
      if (!isNil(data[field]) && hasApiDateFormat(data[field])) {
        return { ...acc, [`${field}_sortable`]: parseISO(data[field]) };
      }

      return acc;
    }, {});

    return {
      ...data,
      ...sortableDateFields,
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
      Records.dataMarkedComplete(jsonData, !(fields === "short" || idSearch), online),
      recordType
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
