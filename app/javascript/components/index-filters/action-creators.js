export const setFilters = ({ recordType, data }) => ({
  type: `${recordType}/SET_FILTERS`,
  payload: data
});

export const applyFilters = ({ recordType, data }) => dispatch => {
  dispatch(setFilters({ recordType, data }));

  dispatch({
    type: `${recordType}/RECORDS`,
    api: {
      path: `/${recordType.toLowerCase()}`,
      params: data
    }
  });
};
