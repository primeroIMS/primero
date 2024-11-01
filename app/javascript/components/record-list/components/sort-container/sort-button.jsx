// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment } from "react";
import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";

import { useI18n } from "../../../i18n";

function Component({ phonetic = false, toggleSortDrawer }) {
  const i18n = useI18n();

  const Wrapper = phonetic ? Tooltip : Fragment;
  const props = phonetic ? { title: i18n.t("messages.record_list.sort_disabled_name_fields") } : {};

  return (
    <Wrapper {...props}>
      <span>
        <IconButton size="large" onClick={toggleSortDrawer} color="primary" disabled={phonetic}>
          <ImportExportIcon />
        </IconButton>
      </span>
    </Wrapper>
  );
}

Component.displayName = "SortButton";

Component.propTypes = {
  phonetic: PropTypes.bool,
  toggleSortDrawer: PropTypes.func.isRequired
};

export default Component;
