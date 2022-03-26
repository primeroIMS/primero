import { useForm } from "react-hook-form";
import { Button } from "@material-ui/core";
import groupBy from "lodash/groupBy";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";

import { useI18n } from "../i18n";
import { SELECT_FIELD, whichFormMode } from "../form";
import WatchedFormSectionField from "../form/components/watched-form-section-field";
import FormSectionField from "../form/components/form-section-field";
import { CONTROLS_GROUP, DATE_CONTROLS, DATE_CONTROLS_GROUP, INSIGHTS_CONFIG } from "../insights/constants";
import { fetchInsight } from "../insights-sub-report/action-creators";
import { clearFilters, setFilters } from "../insights-list/action-creators";

import css from "./styles.css";
import { dateCalculations } from "./utils";
import validations from "./validations";

const Component = ({ moduleID, id, subReport }) => {
  const insightsConfig = INSIGHTS_CONFIG[moduleID];
  const { defaultFilterValues } = insightsConfig;

  const i18n = useI18n();
  const formMethods = useForm({
    mode: "onChange",
    resolver: yupResolver(validations),
    ...(defaultFilterValues && { defaultValues: insightsConfig.defaultFilterValues })
  });
  const formMode = whichFormMode("new");
  const dispatch = useDispatch();

  const transformFilters = data => {
    const { date, view_by: viewBy, date_range: dateRange, to, from, ...rest } = data;

    return omitBy(
      { subreport: subReport, ...rest, ...(viewBy && { [date]: dateCalculations(dateRange, from, to) }) },
      isNil
    );
  };

  const getInsights = (filters = {}) => {
    const transformedFilters = transformFilters(filters);

    dispatch(setFilters(transformedFilters));
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
    getInsights(defaultFilterValues);

    return () => {
      resetFiltersForm();
    };
  }, [subReport]);

  if (isEmpty(insightsConfig.filters)) {
    return null;
  }

  const insightsConfigFilters = groupBy(insightsConfig.filters, filter =>
    DATE_CONTROLS.includes(filter.name) ? DATE_CONTROLS_GROUP : CONTROLS_GROUP
  );

  const submit = data => {
    getInsights(data);
  };

  const filterInputs = (filterGroup = CONTROLS_GROUP) =>
    insightsConfigFilters[filterGroup].map(filter => {
      const FilterInput = filter?.watchedInputs ? WatchedFormSectionField : FormSectionField;

      return <FilterInput field={filter} formMethods={formMethods} formMode={formMode} />;
    });

  const applyLabel = i18n.t("buttons.apply");
  const clearLabel = i18n.t("buttons.clear");

  return (
    <form noValidate onSubmit={formMethods.handleSubmit(submit)}>
      <div className={css.container}>
        <div className={css.dateControlGroup}>{filterInputs(DATE_CONTROLS_GROUP)}</div>
        {filterInputs()}
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
};

Component.displayName = "InsightsFilters";

Component.propTypes = {
  id: PropTypes.string,
  moduleID: PropTypes.string,
  subReport: PropTypes.string
};

export default Component;
