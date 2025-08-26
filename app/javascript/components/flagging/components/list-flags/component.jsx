// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { List } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useMemoizedSelector } from "../../../../libs";
import { useI18n } from "../../../i18n";
import { getActiveFlags, getResolvedFlags } from "../../selectors";
import ListFlagsItem from "../list-flags-item";
import { UPDATE_FLAG_DIALOG } from "../update-flag/constants";
import { useDialog } from "../../../action-dialog";
import { setSelectedFlag } from "../../action-creators";
import css from "../styles.css";

import { NAME } from "./constants";

function Component({ recordType, record }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { setDialog } = useDialog(UPDATE_FLAG_DIALOG);

  const flagsActived = useMemoizedSelector(state => getActiveFlags(state, record, recordType));
  const flagsResolved = useMemoizedSelector(state => getResolvedFlags(state, record, recordType));

  const handleClick = flag => () => {
    dispatch(setSelectedFlag(flag.id));
    setDialog({ dialog: UPDATE_FLAG_DIALOG, open: true });
  };

  const renderFlagsActived =
    Boolean(flagsActived.size) &&
    flagsActived.valueSeq().map(flag => (
      <div key={flag.id}>
        <ListFlagsItem flag={flag} handleClick={handleClick(flag)} />
      </div>
    ));

  const renderFlagsResolved = Boolean(flagsResolved.size) && (
    <>
      <h3>{i18n.t("flags.resolved")}</h3>
      {flagsResolved.valueSeq().map(flag => (
        <div key={flag.id}>
          <ListFlagsItem flag={flag} />
        </div>
      ))}
    </>
  );

  return (
    <>
      {Boolean(flagsActived.size) || Boolean(flagsResolved.size) ? (
        <List>
          <div className={css.activedFlagList}>{renderFlagsActived}</div>
          <div className={css.resolvedFlagList}>{renderFlagsResolved}</div>
        </List>
      ) : (
        <div className={css.empty}>
          <div>
            <FlagIcon fontSize="inherit" />
          </div>
          <h3>{i18n.t("flags.no_flags")}</h3>
        </div>
      )}
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  record: PropTypes.string,
  recordType: PropTypes.string.isRequired
};

export default Component;
