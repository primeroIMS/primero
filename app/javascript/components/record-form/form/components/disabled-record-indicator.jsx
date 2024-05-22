// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Chip } from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import css from "../styles.css";

const DisabledRecordIndicator = ({ recordType }) => {
  const i18n = useI18n();

  return (
    <Chip
      variant="outlined"
      classes={{ root: css.disabledRecord }}
      size="small"
      icon={<BlockIcon />}
      label={i18n.t(`${recordType}.messages.disabled`)}
    />
  );
};

DisabledRecordIndicator.displayName = "DisabledRecordIndicator";

DisabledRecordIndicator.propTypes = {
  recordType: PropTypes.string.isRequired
};

export default DisabledRecordIndicator;
