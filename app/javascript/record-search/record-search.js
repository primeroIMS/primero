import MiniSearch from "minisearch";

import { RECORD_DOCUMENT_FIELDS, RECORD_ID_FIELD, RECORD_TYPE_FIELD } from "../config";

class RecordSearch {
  constructor() {
    if (!RecordSearch.instance) {
      this.search = new MiniSearch({
        fields: RECORD_DOCUMENT_FIELDS,
        storeFields: [RECORD_ID_FIELD, RECORD_TYPE_FIELD],
        searchOptions: { fuzzy: 0.2 }
      });

      RecordSearch.instance = this;
    }

    return RecordSearch.instance;
  }

  addOrUpdateRecords(records) {
    if (records) {
      if (this.search.documentCount >= 0) {
        records.forEach(record => {
          this.addOrUpdateRecord(record);
        });
      } else {
        const documents = records.map(record => RecordSearch.recordToDocument(record));

        this.search.addAll(documents);
      }
    }
  }

  addOrUpdateRecord(record) {
    if (this.search.has(record.id)) {
      this.search.replace(RecordSearch.recordToDocument(record));
    } else {
      this.search.add(RecordSearch.recordToDocument(record));
    }
  }

  getSearch() {
    return this.search;
  }

  static recordToDocument(record) {
    return RECORD_DOCUMENT_FIELDS.reduce(
      (acc, field) => ({
        ...acc,
        [field]: record[field]
      }),
      {}
    );
  }

  syncIndex(data) {
    if (Array.isArray(data)) {
      this.addOrUpdateRecords(data);
    } else {
      this.addOrUpdateRecord(data);
    }
  }
}

const instance = new RecordSearch();

Object.freeze(instance);

export default instance;
