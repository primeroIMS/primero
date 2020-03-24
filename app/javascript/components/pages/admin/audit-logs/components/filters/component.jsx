import React from "react";
import { useSelector } from "react-redux";
import { useForm, FormContext } from "react-hook-form";

import { filterType } from "../../../../../index-filters/utils";
import { FILTER_TYPES } from "../../../../../index-filters";
import { currentUser } from "../../../../../user";

import { NAME } from "./constants";

const Component = () => {
  const userName = useSelector(state => currentUser(state));

  // TODO: LOAD USERS FROM REDUX STORE AND CHECK MULTIPLE PROPERTY
  const filters = [
    {
      name: "audit_log.timestamp",
      field_name: "audit_log_date",
      type: FILTER_TYPES.DATES,
      option_strings_source: null,
      options: {
        en: [{ id: "timestamp", display_name: "Timestamp" }]
      }
    },
    {
      name: "audit_log.user_name",
      field_name: "status",
      option_strings_source: null,
      options: [
        { id: "primero", display_name: "primero" },
        { id: "primero_admin_cp", display_name: "primero_admin_cp" },
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
        { id: "primero_mgr_gbv_ar", display_name: "primero_mgr_gbv_ar" },
        { id: "primero_sup_gbv", display_name: "primero_sup_gbv" },
        { id: "primero_cp", display_name: "primero_cp" },
        { id: "gpadgett", display_name: "gpadgett" }
      ],
      type: FILTER_TYPES.MULTI_SELECT
    }
  ];

  const methods = useForm({
    defaultValues: {}
  });

  const renderFilters = () => {
    return filters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return null;

      return <Filter key={filter.field_name} filter={filter} />;
    });
  };

  return (
    <div>
      <FormContext {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(() => {})}>{renderFilters()}</form>
      </FormContext>
    </div>
  );
};

Component.displayName = NAME;

// Component.propTypes = {};

export default Component;
