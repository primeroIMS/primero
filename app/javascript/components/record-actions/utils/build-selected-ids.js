export default (selectedRecords, records, currentPage, sendKey = "id", excludeIds = []) =>
  selectedRecords && records
    ? records
        .toJS()
        .filter((record, index) => selectedRecords[currentPage]?.includes(index) && !excludeIds.includes(record.id))
        .map(record => record[sendKey])
    : [];
