import { useForm } from "react-hook-form";
import { Button } from "@material-ui/core";
import groupBy from "lodash/groupBy";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import { SELECT_FIELD, whichFormMode } from "../form";
import WatchedFormSectionField from "../form/components/watched-form-section-field";
import FormSectionField from "../form/components/form-section-field";
import { CONTROLS_GROUP, DATE_CONTROLS, DATE_CONTROLS_GROUP, INSIGHTS_CONFIG } from "../insights/constants";
import { fetchInsight } from "../insights-sub-report/action-creators";

import css from "./styles.css";
import { dateCalculations } from "./utils";
import validations from "./validations";

const Component = ({ moduleID, id, subReport }) => {
  const formMethods = useForm({ mode: "onChange", resolver: yupResolver(validations) });
  const insightsConfig = INSIGHTS_CONFIG[moduleID];
  const formMode = whichFormMode("new");
  const dispatch = useDispatch();

  if (isEmpty(insightsConfig.filters)) {
    return null;
  }

  const insightsConfigFilters = groupBy(insightsConfig.filters, filter =>
    DATE_CONTROLS.includes(filter.name) ? DATE_CONTROLS_GROUP : CONTROLS_GROUP
  );

  const submit = data => {
    const { date, view_by: viewBy, date_range: dateRange, to, from, ...rest } = data;
    const filters = { ...rest, ...(viewBy && { [date]: dateCalculations(dateRange, from, to) }) };

    dispatch(fetchInsight(id, subReport, filters));
  };

  const handleClear = () => {
    formMethods.reset(
      Object.fromEntries(insightsConfig.filters.map(val => [val.name, val.type === SELECT_FIELD ? null : ""]))
    );
    dispatch(fetchInsight(id, subReport, {}));
  };

  const filterInputs = (filterGroup = CONTROLS_GROUP) =>
    insightsConfigFilters[filterGroup].map(filter => {
      const FilterInput = filter?.watchedInputs ? WatchedFormSectionField : FormSectionField;

      return <FilterInput field={filter} formMethods={formMethods} formMode={formMode} />;
    });

  return (
    <form noValidate onSubmit={formMethods.handleSubmit(submit)}>
      <div className={css.container}>
        <div className={css.dateControlGroup}>{filterInputs(DATE_CONTROLS_GROUP)}</div>
        {filterInputs()}
      </div>
      <div className={css.actions}>
        <div>
          <Button type="submit" variant="contained" disableElevation color="primary" fullWidth>
            Apply
          </Button>
        </div>
        <div>
          <Button variant="outlined" color="primary" fullWidth onClick={handleClear}>
            Clear
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
