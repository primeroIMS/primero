import { List } from "immutable";
import PropTypes from "prop-types";
import isNil from "lodash/isNil";

import { useMemoizedSelector } from "../../../libs";
import useOptions from "../../form/use-options";
import { get, optionText } from "../../form/utils";
import { DATE_FIELD } from "../../form/constants";
import { useI18n } from "../../i18n";
import { selectInsightsFilters } from "../../insights-list/selectors";

import css from "./styles.css";

const InsightFilterTags = ({ filters = [] }) => {
  const i18n = useI18n();
  const insightFilters = useMemoizedSelector(state => selectInsightsFilters(state));

  const sources = filters.reduce((acc, filter) => {
    if (!isNil(filter.option_strings_source)) {
      return [...acc, [filter.name, filter.option_strings_source]];
    }

    return acc;
  }, []);
  const lookups = useOptions({ source: sources });

  if (insightFilters.isEmpty() || !filters) {
    return null;
  }

  const getOption = (filter = {}, value) => {
    const options = filter.option_strings_source ? lookups[filter.name] : filter?.option_strings_text || [];

    if (filter.type === DATE_FIELD) {
      return i18n.localizeDate(value);
    }

    const option = optionText(
      options.find(opt => get(opt, "id") === value),
      false
    );

    if (filter.option_strings_text) {
      return option ? i18n.t(option) : null;
    }

    if (List.isList(value)) {
      return options
        .filter(opt => value.includes(get(opt, "id")))
        .map(opt => get(opt, "display_text"))
        .join(", ");
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
  filters: PropTypes.object
};

export default InsightFilterTags;
