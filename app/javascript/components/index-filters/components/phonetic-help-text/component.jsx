// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PropTypes from "prop-types";
import { cx } from "@emotion/css";

import { useI18n } from "../../../i18n";
import Tooltip from "../../../tooltip";
import ToogleToolTip from "../toogle-tooltip";

import css from "./styles.css";

function Component({ isPhonetic = true, searchFieldTooltips = [] }) {
  const i18n = useI18n();
  const className = cx(css.searchHelpText, !isPhonetic && css.searchHelpTextNoPhonetic);

  const searchHelpText = isPhonetic
    ? i18n.t("navigation.phonetic_search.help_text")
    : i18n.t("navigation.id_search.help_text");

  return (
    <Tooltip title={<ToogleToolTip isPhonetic={isPhonetic} searchFieldTooltips={searchFieldTooltips} />}>
      <p className={className}>
        <InfoOutlinedIcon />
        <span>{searchHelpText}</span>
      </p>
    </Tooltip>
  );
}

Component.displayName = "PhoneticHelpText";

Component.propTypes = {
  isPhonetic: PropTypes.bool,
  searchFieldTooltips: PropTypes.array
};

export default Component;
