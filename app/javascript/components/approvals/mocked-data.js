import { fromJS } from "immutable";

export default fromJS([
  {
    unique_id: "6e96ab79-d786-4117-a48c-c99194741beb",
    approved_by: "primero",
    approval_date: "2020-01-01",
    approval_status: "rejected",
    approval_for_type: "Action Plan",
    approval_response_for: "case_plan",
    approval_requested_for: null,
    approval_manager_comments: "First comment"
  },
  {
    unique_id: "670332c6-1f1d-415d-9df5-1d94039ce79a",
    approved_by: "primero1",
    approval_date: "2020-01-02",
    approval_status: "approved",
    approval_for_type: "Service Provision",
    approval_response_for: "bia",
    approval_requested_for: null,
    approval_manager_comments: "This is the second comment"
  },
  {
    unique_id: "dab91917-3fbd-4cde-bf42-b09df19dbf08",
    approved_by: "primero2",
    approval_date: "2020-01-03",
    approval_status: "requested",
    approval_for_type: null,
    approval_response_for: null,
    approval_requested_for: "closure",
    approval_manager_comments: "This is third comment"
  },
  {
    unique_id: "e6952ae6-3515-4000-a6c2-b8dcd93cb28a",
    approved_by: "primero3",
    approval_date: "2020-01-04",
    approval_status: "requested",
    approval_for_type: "Case Plan",
    approval_response_for: null,
    approval_requested_for: "case_plan",
    approval_manager_comments: "This is the last comment"
  }
]);
