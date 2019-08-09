export const searchRecords = data => dispatch => {
  dispatch({
    type: `${data.namespace}/SET_RECORD_SEARCH`,
    payload: data.value
  });
};
