// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import slice from "lodash/slice";
import merge from "deepmerge";
import { isImmutable } from "immutable";
import { isDate, parseISO } from "date-fns";

import DB from "../db";
import subformAwareMerge from "../utils/subform-aware-merge";
import { QUICK_SEARCH_FIELDS, DATE_SORTABLE_FIELDS } from "../../config";
import { hasApiDateFormat, reduceMapToObject } from "../../libs/component-helpers";

const Records = {
  find: async ({ collection, recordType, db, json }) => {
    const { id } = db;

    const params =
      json?.api?.params && isImmutable(json?.api?.params) ? reduceMapToObject(json.api.params) : json?.api?.params;

    if (params) {
      const page = params.page || 1;
      const per = params.per || 20;
      const offset = (page - 1) * per;

      if (params.query) {
        const results = await DB.searchIndex(collection, params.query, recordType);
        const sortedResults = params.order_by ? sortBy(results, [params.order_by]) : results;
        const data = slice(sortedResults, offset, offset + per);

        return {
          data: params.order === "desc" ? reverse(data) : data,
          metadata: { per, page, total: results.length }
        };
      }

      const total = await DB.count(collection, "type", recordType);

      const data = await DB.slice(collection, {
        orderBy: params.order_by || "created_at",
        orderDir: params.order || "desc",
        offset,
        limit: per,
        recordType,
        total
      });

      return { data, metadata: { per, page, total } };
    }

    return { data: await DB.getRecord(collection, id) };
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

  dataSearchableFields(data, recordType) {
    if (Array.isArray(data)) {
      return data.map(record => this.dataSearchableFields(record, recordType));
    }

    const sortableDateFields = DATE_SORTABLE_FIELDS.reduce((acc, field) => {
      if (isNil(data[field])) {
        return acc;
      }

      if (isDate(data[field])) {
        return { ...acc, [`${field}_sortable`]: data[field] };
      }

      if (hasApiDateFormat(data[field])) {
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
    const markComplete = !(fields === "short" || idSearch);
    const recordData = Records.dataSearchableFields(
      Records.dataMarkedComplete(jsonData, markComplete, online),
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
      },
      callbacks: {
        beforeSave(record, prev) {
          if (prev) {
            return {
              ...record,
              complete_sortable: prev.complete || record.complete ? 1 : 0,
              has_photo: prev.photo || record.photo ? 1 : 0
            };
          }

          return {
            ...record,
            complete_sortable: 0,
            has_photo: 0
          };
        }
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
