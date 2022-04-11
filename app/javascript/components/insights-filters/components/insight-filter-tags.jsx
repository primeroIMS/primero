import { fromJS } from "immutable";
import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../libs";
import { getLookupsByIDs } from "../../form/selectors";
import { get, optionText } from "../../form/utils";
import transformOptions from "../../form/utils/transform-options";
import { useI18n } from "../../i18n";
import { selectInsightsFilters } from "../../insights-list/selectors";

import css from "./styles.css";

const InsightFilterTags = ({ filters }) => {
  const i18n = useI18n();
  const insightFilters = useMemoizedSelector(state => selectInsightsFilters(state));

  const lookups = useMemoizedSelector(state =>
    getLookupsByIDs(
      state,
      filters.map(filter => filter.option_strings_source).filter(source => source)
    )
  );

  if (insightFilters.isEmpty()) {
    return null;
  }

  const getOption = (filter, value, dateFilter = false) => {
    const options = filter.option_strings_source
      ? transformOptions(
          lookups
            .find(lookup => lookup.get("unique_id") === filter.option_strings_source.replace("lookup ", ""))
            ?.get("values") || fromJS([]),
          i18n.locale
        )
      : filter?.option_strings_text;

    if (dateFilter) {
      return options.find(opt => get(opt, "id") === value).display_name;
    }

    return optionText(
      options.find(opt => get(opt, "id") === value),
      false
    );
  };

  const getValue = (filter, value, dateKey) => {
    if (dateKey) {
      return (
        <div className={css.dateGroup}>
          <div>
            <span>{i18n.t("fields.date_range.from")}</span>
            <span>{i18n.localizeDate(value.get("from"))}</span>
          </div>
          <div>
            <span>{i18n.t("fields.date_range.to")}</span>
            <span>{i18n.localizeDate(value.get("to"))}</span>
          </div>
        </div>
      );
    }

    const selectedOption = getOption(filter, value);

    return <span>{Array.isArray(selectedOption) ? i18n.t(selectedOption?.join(".")) : selectedOption}</span>;
  };

  return (
    <div className={css.container}>
      {insightFilters.entrySeq().map(([key, value]) => {
        const filter = filters.find(
          iFilter => iFilter.name === key || (key.includes("date") && iFilter.name === "date")
        );
        const isDateFilter = key.includes("date");

        return (
          <div key={key} className={css.filter}>
            <div>{i18n.t(isDateFilter ? getOption(filter, key, true)?.join(".") : filter?.display_name.join("."))}</div>
            <div>{getValue(filter, value, key.includes("date") ? key : false)}</div>
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
