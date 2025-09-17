// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { List } from "immutable";
import PropTypes from "prop-types";

import { LOOKUPS } from "../../../../config";
import { useMemoizedSelector } from "../../../../libs";
import useOptions from "../../../form/use-options";
import { useI18n } from "../../../i18n";
import { getOptionText } from "../../../record-form/form/subforms/subform-traces/components/field-row/utils";
import findOptionDisplayText from "../../../record-form/form/utils/find-option-display-text";
import { getFieldByName } from "../../../record-form/selectors";
import { getShortIdFromUniqueId } from "../../../records";

import indicatorCss from "./styles.css";

function Component({ data }) {
  const i18n = useI18n();
  const groupAgeBandField = useMemoizedSelector(state => getFieldByName(state, "group_age_band"));
  const genderLookup = useOptions({ source: LOOKUPS.gender_unknown_mixed });
  const shortId = getShortIdFromUniqueId(data.get("unique_id"));

  const groupSex = data.get("group_gender");
  const sex = groupSex && getOptionText({ options: genderLookup, value: groupSex });
  const groupAgeBand = data.get("group_age_band");
  const age =
    groupAgeBand &&
    List.isList(groupAgeBand) &&
    groupAgeBand
      .reduce(
        (memo, elem) =>
          memo.concat(
            findOptionDisplayText({
              i18n: { locale: i18n.locale },
              customLookups: [],
              options: groupAgeBandField.option_strings_text,
              value: elem
            })
          ),
        []
      )
      .join(", ");

  return (
    <div className={indicatorCss.listItemText}>
      <span>{shortId}</span>
      {sex && <span>{sex}</span>}
      {age && <span>{age}</span>}
    </div>
  );
}

Component.displayName = "GroupVictim";

Component.propTypes = {
  data: PropTypes.object
};

export default Component;
