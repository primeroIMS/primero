import { List } from "immutable";
import PropTypes from "prop-types";
import isNil from "lodash/isNil";

import { RECORD_TYPES } from "../../../config";
import { useMemoizedSelector } from "../../../libs";
import { getWorkflowLabels } from "../../application";
import useOptions from "../../form/use-options";
import { get, optionText } from "../../form/utils";
import transformOptions from "../../form/utils/transform-options";
import { DATE_FIELD } from "../../form/constants";
import { useI18n } from "../../i18n";
import { selectInsightsFilters } from "../../insights-list/selectors";
import { WORKFLOW } from "../../insights/constants";

import css from "./styles.css";

const InsightFilterTags = ({ filters = [], moduleID }) => {
  const i18n = useI18n();
  const workflowLabels = useMemoizedSelector(state => getWorkflowLabels(state, moduleID, RECORD_TYPES.cases));
  const insightFilters = useMemoizedSelector(state => selectInsightsFilters(state));

  const sources = filters.reduce((acc, filter) => {
    if (!isNil(filter.option_strings_source)) {
      return [...acc, [filter.name, filter.option_strings_source]];
    }

    return acc;
  }, []);
  const lookups = useOptions({ source: sources, optionStringsSourceIdKey: "unique_id" });

  if (insightFilters.isEmpty() || !filters) {
    return null;
  }

  const filterOptions = filter => {
    if (filter.option_strings_source) {
      return lookups[filter.name];
    }

    if (filter.option_strings_text) {
      return filter.option_strings_text;
    }

    if (filter.name === WORKFLOW) {
      return transformOptions(workflowLabels, i18n.locale);
    }

    return [];
  };

  const getOption = (filter = {}, value) => {
    if (filter.type === DATE_FIELD) {
      return i18n.localizeDate(value);
    }

    const options = filterOptions(filter);

    if (List.isList(value)) {
      return options
        .filter(opt => value.includes(get(opt, "id")))
        .map(opt => {
          if (filter.option_strings_text) {
            return i18n.t(optionText(opt, false));
          }

          return get(opt, "display_text");
        })
        .join(", ");
    }

    const option = optionText(
      options.find(opt => get(opt, "id") === value),
      false
    );

    if (filter.option_strings_text) {
      return option ? i18n.t(option) : null;
    }

    return option;
  };

  return (
    <div className={css.container}>
      {filters.map(filter => {
        const value = getOption(filter, insightFilters.get(filter.name));

        if (!value) {
          return null;
        }

        return (
          <div key={filter.name} className={css.filter}>
            <div>{i18n.t(filter.display_name)}</div>
            <div>{value}</div>
          </div>
        );
      })}
    </div>
  );
};

InsightFilterTags.displayName = "InsightFilterTags";

InsightFilterTags.propTypes = {
  filters: PropTypes.object,
  moduleID: PropTypes.string
};

export default InsightFilterTags;
