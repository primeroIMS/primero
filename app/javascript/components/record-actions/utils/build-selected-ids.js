export default (selectedRecords, records, currentPage, sendKey = "id") =>
  selectedRecords && records
    ? records
        .toJS()
        .filter((_r, i) => selectedRecords[currentPage]?.includes(i))
        .map(r => r[sendKey])
    : [];
