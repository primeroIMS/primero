import { fromJS, List } from "immutable";
import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../libs";
import { getLookupsByIDs } from "../../form/selectors";
import { get, optionText } from "../../form/utils";
import { DATE_FIELD } from "../../form/constants";
import transformOptions from "../../form/utils/transform-options";
import { useI18n } from "../../i18n";
import { selectInsightsFilters } from "../../insights-list/selectors";

import css from "./styles.css";

const InsightFilterTags = ({ filters = [] }) => {
  const i18n = useI18n();
  const insightFilters = useMemoizedSelector(state => selectInsightsFilters(state));

  const lookups = useMemoizedSelector(state =>
    getLookupsByIDs(
      state,
      filters.map(filter => filter.option_strings_source).filter(source => source)
    )
  );

  if (insightFilters.isEmpty() || !filters) {
    return null;
  }

  const getOption = (filter = {}, value) => {
    const options = filter.option_strings_source
      ? transformOptions(
          lookups
            .find(lookup => lookup.get("unique_id") === filter.option_strings_source.replace("lookup ", ""))
            ?.get("values") || fromJS([]),
          i18n.locale
        )
      : filter?.option_strings_text || [];

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
