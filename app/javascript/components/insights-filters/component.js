import { useForm } from "react-hook-form";
import { Button } from "@material-ui/core";
import groupBy from "lodash/groupBy";

import { whichFormMode } from "../form";
import WatchedFormSectionField from "../form/components/watched-form-section-field";
import FormSectionField from "../form/components/form-section-field";
import { CONTROLS_GROUP, DATE_CONTROLS, DATE_CONTROLS_GROUP, INSIGHTS_CONFIG } from "../insights/constants";

import css from "./styles.css";

const Component = () => {
  const formMethods = useForm({ mode: "onChange" });
  const insightsConfig = INSIGHTS_CONFIG.mrm;
  const formMode = whichFormMode("new");

  const insightsConfigFilters = groupBy(insightsConfig.filters, filter =>
    DATE_CONTROLS.includes(filter.name) ? DATE_CONTROLS_GROUP : CONTROLS_GROUP
  );

  const submit = data => {
    console.log(data);
  };

  const handleClear = () => {
    formMethods.reset({});
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

export default Component;
