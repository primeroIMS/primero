// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { List } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../../libs";
import { useI18n } from "../../../i18n";
import { getActiveFlags, getResolvedFlags } from "../../selectors";
import ListFlagsItem from "../list-flags-item";
import css from "../styles.css";

import { NAME } from "./constants";

function Component({ recordType, record }) {
  const i18n = useI18n();

  const flagsActived = useMemoizedSelector(state => getActiveFlags(state, record, recordType));
  const flagsResolved = useMemoizedSelector(state => getResolvedFlags(state, record, recordType));

  const renderFlagsActived =
    Boolean(flagsActived.size) &&
    flagsActived.valueSeq().map(flag => (
      <div key={flag.id}>
        <ListFlagsItem flag={flag} />
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
