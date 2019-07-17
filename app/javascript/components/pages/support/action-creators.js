import * as Actions from "./actions";

export const fetchData = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_DATA,
    payload: {
      data: {
        name: "Simon Nehme",
        organization: "UNICEF",
        position: "Child Protection Officer - CPIMS Administrator",
        phone: "+961 70 673 187",
        email: "snehme@unicef.org",
        location: "United Nations Children’s Fund Lebanon",
        support_forum: "https://google.com",
        other_information: "",
        primero_version: "1.3.15"
      }
    }
  });
};
