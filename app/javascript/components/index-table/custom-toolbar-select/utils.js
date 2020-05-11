/* eslint-disable import/prefer-default-export */

export const selectAllRecords = (totalRecords, perPage) => {
  if (totalRecords === 0) {
    return { 0: [] };
  }

  const recordsSelected = {};
  const keys = Math.ceil(totalRecords / perPage);
  let recordsInCurrentPage = totalRecords;

  for (let i = 0; i < keys; i += 1) {
    const recordsPerPage =
      perPage > recordsInCurrentPage ? recordsInCurrentPage : perPage;

    recordsSelected[i] = [...Array(recordsPerPage).keys()];
    recordsInCurrentPage -= perPage;
  }

  return recordsSelected;
};
