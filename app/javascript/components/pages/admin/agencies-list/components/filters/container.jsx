import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, FormContext } from "react-hook-form";

import { filterType } from "../../../../../index-filters/utils";
import { FILTER_TYPES } from "../../../../../index-filters";
import { currentUser } from "../../../../../user";
import Actions from "../../../../../index-filters/components/actions";
import { fetchAgencies } from "../../action-creators";
import { useI18n } from "../../../../../i18n";

import { NAME, DISABLED } from "./constants";

const Container = () => {
  const methods = useForm();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const userName = useSelector(state => currentUser(state));

  const filters = [
    {
      name: "cases.filter_by.enabled_disabled",
      field_name: DISABLED,
      type: FILTER_TYPES.MULTI_TOGGLE,
      option_strings_source: null,
      options: {
        en: [
          { id: "false", display_name: i18n.t("disabled.status.enabled") },
          { id: "true", display_name: i18n.t("disabled.status.disabled") }
        ]
      }
    }
  ];

  const onSubmit = data => dispatch(fetchAgencies({ options: data }));

  const onClear = () => {
    methods.setValue(DISABLED, []);
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
