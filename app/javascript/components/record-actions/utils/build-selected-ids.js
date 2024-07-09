// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (selectedRecords, records, currentPage, sendKey = "id") =>
  selectedRecords && records
    ? records
        .toJS()
        .filter((_record, index) => selectedRecords[currentPage]?.includes(index))
        .map(record => record[sendKey])
    : [];
