import PropTypes from "prop-types";
import { memo } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { cx } from "@emotion/css";

import { useI18n } from "../../../i18n";
import Tooltip from "../../../tooltip";
import ToogleToolTip from "../toogle-tooltip";
import { useMemoizedSelector } from "../../../../libs";
import { getTooltipFields } from "../../selectors";
import displayNameHelper from "../../../../libs/display-name-helper";

import css from "./styles.css";

const HELP_TEXT_I18N_KEY = {
  id_search: "navigation.id_search.help_text",
  phonetic: "navigation.phonetic_search.help_text",
  phone_number: "navigation.phone_number_search.help_text"
};

function Component({ recordType = "case", searchField }) {
  const i18n = useI18n();
  const tooltipFields = useMemoizedSelector(state => getTooltipFields(state, recordType, searchField));
  const searchFieldTooltips = tooltipFields?.map(obj => displayNameHelper(obj, i18n.locale));
  const className = cx(css.searchHelpText, searchField === "id_search" && css.searchHelpTextNoPhonetic);

  const searchHelpText = i18n.t(HELP_TEXT_I18N_KEY[searchField]);

  return (
    <Tooltip title={<ToogleToolTip searchField={searchField} searchFieldTooltips={searchFieldTooltips} />}>
      <p className={className}>
        <InfoOutlinedIcon />
        <span>{searchHelpText}</span>
      </p>
    </Tooltip>
  );
}

Component.displayName = "SearchHelpText";

Component.propTypes = {
  recordType: PropTypes.string,
  searchField: PropTypes.string
};

export default memo(Component);
