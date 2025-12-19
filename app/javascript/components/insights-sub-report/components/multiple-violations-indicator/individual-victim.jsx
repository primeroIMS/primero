// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { LOOKUPS } from "../../../../config";
import useOptions from "../../../form/use-options";
import { getShortIdFromUniqueId } from "../../../records";
import { getOptionText } from "../../../record-form/form/subforms/subform-traces/components/field-row/utils";

import indicatorCss from "./styles.css";

function Component({ data }) {
  const genderLookup = useOptions({ source: LOOKUPS.gender_unknown });

  const shortId = getShortIdFromUniqueId(data.get("unique_id"));
  const age = data.get("individual_age");
  const sex = getOptionText({ options: genderLookup, value: data.get("individual_sex") });

  return (
    <div className={indicatorCss.listItemText}>
      <span>{shortId}</span>
      {sex && <span>{sex}</span>}
      {age && <span>{age}</span>}
    </div>
  );
}

Component.displayName = "IndividualVictim";

Component.propTypes = {
  data: PropTypes.object
};

export default Component;
