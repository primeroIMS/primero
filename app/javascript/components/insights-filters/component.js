// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import groupBy from "lodash/groupBy";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  RECORD_TYPES,
  REFERRAL_TRANSFERS_SUBREPORTS,
  VIOLENCE_TYPE_SUBREPORTS,
  WORKFLOW_SUBREPORTS
} from "../../config";
import { fetchUserGroups, useApp } from "../application";
import { READ_RECORDS, RESOURCES, usePermissions } from "../permissions";
import { useI18n } from "../i18n";
import { OPTION_TYPES, SELECT_FIELD, whichFormMode } from "../form";
import WatchedFormSectionField from "../form/components/watched-form-section-field";
import FormSectionField from "../form/components/form-section-field";
import { useMemoizedSelector } from "../../libs";
import {
  CONTROLS_GROUP,
  DATE_CONTROLS,
  DATE_CONTROLS_GROUP,
  INSIGHTS_CONFIG,
  MODULE_ID,
  OWNED_BY_GROUPS,
  WORKFLOW
} from "../insights/constants";
import { fetchInsight } from "../insights-sub-report/action-creators";
import { clearFilters, setFilters } from "../insights-list/action-creators";
import useOptions from "../form/use-options";
import { compactBlank } from "../record-form/utils";
import { getIsManagedReportScopeAll } from "../user";
import { getAllWorkflowLabels } from "../application/selectors";

import css from "./styles.css";
import { transformFilters } from "./utils";
import validations from "./validations";

function Component({ id, subReport, toggleControls }) {
  const isManagedReportScopeAll = useMemoizedSelector(state => getIsManagedReportScopeAll(state));

  const app = useApp();
  const canReadUserGroups = usePermissions(RESOURCES.user_groups, READ_RECORDS);
  const userGroups = useOptions({ source: OPTION_TYPES.INSIGHTS_USER_GROUP_PERMITTED });
  const insightsConfig = INSIGHTS_CONFIG[id];
  const { defaultFilterValues } = insightsConfig;

  const workflowLabels = useMemoizedSelector(state => getAllWorkflowLabels(state, RECORD_TYPES.cases));

  const i18n = useI18n();
  const formMethods = useForm({
    mode: "onChange",
    resolver: yupResolver(
      validations(
        i18n,
        insightsConfig.filters?.map(filter => filter.name)
      )
    ),
    ...(defaultFilterValues && {
      defaultValues: { ...insightsConfig.defaultFilterValues }
    })
  });
  const formMode = whichFormMode("new");
  const dispatch = useDispatch();
  const isWorkflowSubreport = WORKFLOW_SUBREPORTS.includes(subReport);
  const isViolenceTypeSubreport = VIOLENCE_TYPE_SUBREPORTS.includes(subReport);
  const isReferralsTransferSubreport = REFERRAL_TRANSFERS_SUBREPORTS.includes(subReport);

  const getInsights = (filters = {}) => {
    const transformedFilters = { ...transformFilters(filters), subreport: subReport };

    toggleControls();

    dispatch(setFilters({ ...filters, subreport: subReport }));
    dispatch(fetchInsight(id, subReport, transformedFilters));
  };

  const resetFiltersForm = () => {
    dispatch(clearFilters());

    formMethods.reset(
      defaultFilterValues ||
        Object.fromEntries(insightsConfig.filters.map(val => [val.name, val.type === SELECT_FIELD ? null : ""]))
    );
  };

  const handleClear = () => {
    resetFiltersForm();
    getInsights(defaultFilterValues);
  };

  useEffect(() => {
    if (isViolenceTypeSubreport || isWorkflowSubreport || isReferralsTransferSubreport) {
      if (canReadUserGroups || isManagedReportScopeAll) {
        dispatch(fetchUserGroups());
      }

      if (userGroups.length > 0) {
        formMethods.setValue(OWNED_BY_GROUPS, userGroups[0]?.id);
      }
    }
  }, [isWorkflowSubreport, isViolenceTypeSubreport, isReferralsTransferSubreport, userGroups.length]);

  useEffect(() => {
    getInsights(formMethods.getValues());
  }, [subReport]);

  useEffect(() => {
    if (app.userModules.size <= 1) {
      formMethods.register(MODULE_ID);
      formMethods.setValue(MODULE_ID, app.userModules.getIn([0, "unique_id"]));
    }
  }, [app.userModules.size]);

  if (isEmpty(insightsConfig.filters)) {
    return null;
  }

  const insightsConfigFilters = groupBy(insightsConfig.filters, filter =>
    DATE_CONTROLS.includes(filter.name) ? DATE_CONTROLS_GROUP : CONTROLS_GROUP
  );

  const submit = data => {
    getInsights(compactBlank(data));
  };

  const filterInputs = (filterGroup = CONTROLS_GROUP) =>
    insightsConfigFilters[filterGroup]?.map(filter => {
      const FilterInput = filter?.watchedInputs ? WatchedFormSectionField : FormSectionField;

      if (app.userModules.size <= 1 && filter.name === MODULE_ID) {
        return false;
      }

      if (filter && filter.name === WORKFLOW) {
        // eslint-disable-next-line no-param-reassign
        filter = filter.set("option_strings_text", workflowLabels);
      }

      return <FilterInput field={filter} formMethods={formMethods} formMode={formMode} />;
    });

  const applyLabel = i18n.t("buttons.apply");
  const clearLabel = i18n.t("buttons.clear");

  return (
    <form noValidate onSubmit={formMethods.handleSubmit(submit)}>
      <div className={css.container}>
        <div className={css.dateControlGroup}>{filterInputs(DATE_CONTROLS_GROUP)}</div>
        <div className={css.filters}>{filterInputs()}</div>
      </div>
      <div className={css.actions}>
        <div>
          <Button type="submit" variant="contained" disableElevation color="primary" fullWidth>
            {applyLabel}
          </Button>
        </div>
        <div>
          <Button variant="outlined" color="primary" fullWidth onClick={handleClear}>
            {clearLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

Component.displayName = "InsightsFilters";

Component.propTypes = {
  id: PropTypes.string,
  subReport: PropTypes.string,
  toggleControls: PropTypes.func.isRequired
};

export default Component;
