import { List, Box, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import FlagIcon from "@material-ui/icons/Flag";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import ListFlagsItem from "../list-flags-item";
import styles from "../styles.css";
import { getActiveFlags, getResolvedFlags } from "../../selectors";

import { NAME } from "./constants";

const Component = ({ recordType, record }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const flagsActived = useSelector(state => getActiveFlags(state, record, recordType));

  const flagsResolved = useSelector(state => getResolvedFlags(state, record, recordType));

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
        <Box className={css.empty}>
          <Box>
            <FlagIcon fontSize="inherit" />
          </Box>
          <h3>{i18n.t("flags.no_flags")}</h3>
        </Box>
      )}
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  record: PropTypes.string,
  recordType: PropTypes.string.isRequired
};

export default Component;
