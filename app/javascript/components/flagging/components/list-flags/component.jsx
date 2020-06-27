import React, { useState } from "react";
import { List, Divider, Box, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import FlagIcon from "@material-ui/icons/Flag";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import ListFlagsItem from "../list-flags-item";
import Unflag from "../Unflag";
import styles from "../styles.css";
import { getActiveFlags, getResolvedFlags } from "../../selectors";

import { NAME } from "./constants";

const Component = ({ recordType, record }) => {
  const [deleteFlag, setDeleteFlag] = useState({ deleteMode: false, id: "" });
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const flagsActived = useSelector(state =>
    getActiveFlags(state, record, recordType)
  );

  const flagsResolved = useSelector(state =>
    getResolvedFlags(state, record, recordType)
  );

  const handleDelete = id => {
    setDeleteFlag({ deleteMode: true, id });
  };

  const { deleteMode, id } = deleteFlag;

  const listFlagsItemProps = {
    ...(!deleteMode ? { handleDelete } : {})
  };

  const selectedFlag =
    flagsActived
      .filter(f => f.id === deleteFlag.id)
      .valueSeq()
      .first() || null;

  const unflagProps = {
    flag: selectedFlag,
    setDeleteFlag,
    id,
    recordType,
    record
  };

  const renderFlagsActived =
    Boolean(flagsActived.size) &&
    flagsActived.valueSeq().map((flag, index) => (
      <div key={flag.id}>
        <ListFlagsItem flag={flag} {...listFlagsItemProps} />
        {flagsActived.size !== index + 1 && <Divider component="li" />}
      </div>
    ));

  const renderFlagsResolved = Boolean(flagsResolved.size) && (
    <>
      <h3>{i18n.t("flags.resolved")}</h3>
      {flagsResolved.valueSeq().map((flag, index) => (
        <div key={flag.id}>
          <ListFlagsItem flag={flag} {...listFlagsItemProps} />
          {flagsResolved.size !== index + 1 && <Divider component="li" />}
        </div>
      ))}
    </>
  );

  return (
    <>
      {Boolean(flagsActived.size) || Boolean(flagsResolved.size) ? (
        <List>
          {deleteMode ? (
            <>
              <Box px={2}>
                <h4>{i18n.t("flags.unflag")}</h4>
              </Box>
              <ListFlagsItem flag={selectedFlag} {...listFlagsItemProps} />
            </>
          ) : (
            <>
              <div className={css.activedFlagList}>{renderFlagsActived}</div>
              <div className={css.resolvedFlagList}>{renderFlagsResolved}</div>
            </>
          )}
        </List>
      ) : (
        <Box className={css.empty}>
          <Box>
            <FlagIcon fontSize="inherit" />
          </Box>
          <h3>{i18n.t("flags.no_flags")}</h3>
        </Box>
      )}
      {deleteMode && <Unflag {...unflagProps} />}
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  record: PropTypes.string,
  recordType: PropTypes.string.isRequired
};

export default Component;
