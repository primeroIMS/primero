// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import { useI18n } from "../../../i18n";

import css from "./styles.css";

function Component() {
  const i18n = useI18n();
  const searchHelpText = i18n.t("navigation.phonetic_search.help_text");

  return (
    <p className={css.searchHelpText}>
      <InfoOutlinedIcon />
      <span>{searchHelpText}</span>
    </p>
  );
}

Component.displayName = "PhoneticHelpText";

export default Component;
