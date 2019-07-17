import * as Actions from "./actions";

export const fetchPotentialMatches = () => async dispatch => {
  dispatch({
    type: Actions.POTENTIAL_MATCHES,
    payload: {
      data: {
        tracingRequestId: "123",
        relationName: "CP Admin",
        inquiryDate: "2018-01-06",
        tracingRequest: "",
        matches: [
          {
            caseId: "#1234",
            age: "11",
            sex: "male",
            user: "primero_admin_cp",
            agency: "agency-unicef",
            score: "Possible"
          }
        ]
      }
    }
  });
};
