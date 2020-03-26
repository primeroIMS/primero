import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, FormContext } from "react-hook-form";

import { filterType } from "../../../../../index-filters/utils";
import { FILTER_TYPES } from "../../../../../index-filters";
import { currentUser } from "../../../../../user";
import { fetchAuditLogs } from "../../action-creators";
import Actions from "../../../../../index-filters/components/actions";
import { getFilterUsers } from "../../selectors";
import { searchableUsers, buildAuditLogsQuery } from "../../helpers";

import { NAME, USER_NAME, TIMESTAMP } from "./constants";

const Container = () => {
  const methods = useForm();
  const dispatch = useDispatch();
  const filterUsers = useSelector(state => getFilterUsers(state));
  const userName = useSelector(state => currentUser(state));

  const filters = [
    {
      name: "audit_log.timestamp",
      field_name: "audit_log_date",
      type: FILTER_TYPES.DATES,
      option_strings_source: null,
      options: {
        en: [{ id: TIMESTAMP, display_name: "Timestamp" }]
      }
    },
    {
      name: "audit_log.user_name",
      field_name: USER_NAME,
      option_strings_source: null,
      options: searchableUsers(filterUsers),
      type: FILTER_TYPES.MULTI_SELECT,
      multiple: false
    }
  ];

  const onSubmit = data =>
    dispatch(fetchAuditLogs({ options: buildAuditLogsQuery(data) }));

  const onClear = () => {
    methods.setValue(USER_NAME, {});
    methods.setValue(TIMESTAMP, undefined);
  };

  const renderFilters = () => {
    return filters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return null;

      return (
        <Filter
          key={filter.field_name}
          filter={filter}
          multiple={filter.multiple}
        />
      );
    });
  };

  return (
    <div>
      <FormContext {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Actions handleClear={onClear} />
          {renderFilters()}
        </form>
      </FormContext>
    </div>
  );
};

Container.displayName = NAME;

export default Container;
