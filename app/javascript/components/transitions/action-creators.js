import * as Actions from "./actions";

export const fetchTransitions = (recordType, record) => async dispatch => {
  dispatch({
    type: Actions.FETCH_TRANSITIONS,
    // api: {
    //   path: `${recordType}/${record}/transitions`
    // }
    payload: {
      data: [
        {
          id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
          record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
          record_type: "case",
          created_at: "2019-10-21T16:13:33.890Z",
          notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          status: "inprogress",
          type: "Transfer",
          consent_overridden: false,
          consent_individual_transfer: true,
          transitioned_by: "primero",
          transitioned_to: "primero_mgr_cp"
        },
        {
          id: "ee1ddfad-cc11-42df-9f39-14c7e6a3c1bb",
          record_id: "860ee0ca-0165-4ab8-8750-663cec9fb320",
          record_type: "case",
          created_at: "2019-10-18T16:06:36.875Z",
          notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          status: "done",
          type: "Assign",
          transitioned_by: "primero",
          transitioned_to: "primero_cp"
        },
        {
          id: "4149728e-ccd9-5ac5-a1c1-c3c0fd063fc8",
          record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
          record_type: "case",
          created_at: "2019-10-13T16:13:33.890Z",
          notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          rejected_reason: "This is a transfer rejected",
          status: "rejected",
          type: "Transfer",
          consent_overridden: true,
          consent_individual_transfer: false,
          transitioned_by: "primero",
          transitioned_to: "primero_mgr_cp"
        },
        {
          id: "e172bbdd-4a99-4b8e-a2a5-e7e0af36f19a",
          record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
          record_type: "case",
          created_at: "2019-10-10T16:30:33.452Z",
          notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          status: "done",
          type: "Assign",
          transitioned_by: "primero",
          transitioned_to: "primero_cp"
        }
      ]
    }
  });
};
