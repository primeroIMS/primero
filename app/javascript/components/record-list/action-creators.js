const fetchRecords = data => async dispatch => {
  dispatch({
    type: `${data.namespace}/SET_FILTERS`,
    payload: data.options
  });

  dispatch({
    type: `${data.namespace}/RECORDS`,
    api: {
      path: data.path,
      params: data.options
    }
  });
};

export default {
  fetchRecords
};
