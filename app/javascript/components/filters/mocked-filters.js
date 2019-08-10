export default [
  {
    id: "my_cases",
    display_name: "My Cases",
    type: "switch",
    options: {
      values: [
        { id: "my_cases", display_name: "My Cases" },
        { id: "referred_cases", display_name: "Cases referred to me" }
      ]
    }
  },
  {
    id: "flagged",
    display_name: "Flagged",
    type: "switch",
    options: {
      values: [{ id: "flagged_label", display_name: "Flagged" }]
    }
  },
  {
    id: "mobile",
    display_name: "Mobile",
    type: "switch",
    options: {
      values: [
        {
          id: "mark_for_mobile",
          display_name: "Marked for mobile"
        }
      ]
    }
  },
  {
    id: "social_worker",
    display_name: "Social Worker",
    type: "checkbox",
    options: {
      values: [
        { id: "primero", display_name: "primero" },
        { id: "primero_admin_cp", display_name: "primero_admin_cp" },
        { id: "primero_cp", display_name: "primero_cp" },
        { id: "primero_mgr_cp", display_name: "primero_mgr_cp" },
        { id: "primero_gbv", display_name: "primero_gbv" },
        { id: "primero_mgr_gbv", display_name: "primero_mgr_gbv" },
        { id: "primero_ftr_manager", display_name: "primero_ftr_manager" },
        { id: "primero_user_mgr_cp", display_name: "primero_user_mgr_cp" },
        { id: "primero_user_mgr_gbv", display_name: "primero_user_mgr_gbv" },
        { id: "agency_user_admin", display_name: "agency_user_admin" },
        {
          id: "primero_system_admin_gbv",
          display_name: "primero_system_admin_gbv"
        },
        { id: "agency_user_admin_gbv", display_name: "agency_user_admin_gbv" },
        { id: "primero_cp_ar", display_name: "primero_cp_ar" },
        { id: "primero_mgr_cp_ar", display_name: "primero_mgr_cp_ar" },
        { id: "primero_gbv_ar", display_name: "primero_gbv_ar" },
        { id: "primero_mgr_gbv_ar", display_name: "primero_mgr_gbv_ar" }
      ]
    }
  },
  {
    id: "approval_status",
    display_name: "Approval Status",
    type: "checkbox",
    options: {
      values: [
        { id: "bia", display_name: "BIA" },
        { id: "case_plan", display_name: "Case Plan" },
        { id: "closure", display_name: "Closure" }
      ]
    }
  },
  {
    id: "child_status",
    display_name: "Case Status",
    type: "radio",
    reset: true,
    options: {
      values: [
        { id: "open", display_name: "Open" },
        { id: "closed", display_name: "Closed" },
        { id: "transferred", display_name: "Transferred" },
        { id: "duplicate", display_name: "Duplicate" }
      ]
    }
  },
  {
    id: "age_range",
    display_name: "Age",
    reset: true,
    type: "multi_toggle",
    options: {
      values: [
        { id: "age_0_5", display_name: "0 - 5" },
        { id: "age_6_11", display_name: "6 - 11" },
        { id: "age_12_17", display_name: "12 - 17" },
        { id: "age_18_more", display_name: "18+" }
      ]
    }
  },
  {
    id: "sex",
    display_name: "Sex",
    type: "multi_toggle",
    reset: true,
    options: {
      values: [
        { id: "female", display_name: "Female" },
        { id: "male", display_name: "Male" }
      ]
    }
  },
  {
    id: "risk_level",
    display_name: "Risk Level",
    type: "chips",
    reset: true,
    options: {
      values: [
        {
          id: "high",
          display_name: "High",
          css_color: "red",
          filled: true
        },
        {
          id: "medium",
          display_name: "Medium",
          css_color: "orange",
          filled: true
        },
        {
          id: "low",
          display_name: "Low",
          css_color: "orange",
          filled: false
        },
        {
          id: "no_action",
          display_name: "No Action",
          css_color: "darkGrey",
          filled: false
        }
      ]
    }
  },
  {
    id: "by_date",
    display_name: "By Date",
    type: "dates",
    options: {
      values: [
        { id: "date_of_birth", display_name: "Dates of Birth" },
        { id: "created_at", display_name: "Creation Date" }
      ],
      defaultValue: "created_at",
      min_date: "",
      max_date: ""
    }
  },
  {
    id: "record_state",
    display_name: "Record State",
    type: "multi_toggle",
    reset: true,
    options: {
      values: [
        { id: "valid", display_name: "Valid" },
        { id: "invalid", display_name: "Invalid" }
      ]
    }
  },
  {
    id: "approval_status_select",
    display_name: "Approval Status - Select",
    type: "select",
    options: {
      values: [
        { id: "bia", display_name: "BIA" },
        { id: "case_plan", display_name: "Case Plan" },
        { id: "closure", display_name: "Closure" }
      ]
    }
  },
  {
    id: "approval_status_select_multiple",
    display_name: "Approval Status - Select Multiple",
    type: "multi_select",
    options: {
      values: [
        { id: "bia", display_name: "BIA" },
        { id: "case_plan", display_name: "Case Plan" },
        { id: "closure", display_name: "Closure" }
      ]
    }
  }
];
