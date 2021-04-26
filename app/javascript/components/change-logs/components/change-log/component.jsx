import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Timeline from "@material-ui/lab/Timeline";

import { useI18n } from "../../../i18n";
import ChangeLogItem from "../change-log-item";
import { buildDataItems } from "../../utils";
import styles from "../../styles.css";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({
  recordChangeLogs,
  setOpen,
  setRecordChanges,
  setCalculatingChangeLog,
  allFields,
  allLookups,
  locations,
  allAgencies
}) => {
  const i18n = useI18n();
  const css = useStyles();

  const handleSeeDetails = subformChanges => {
    setOpen(true);
    setCalculatingChangeLog(true);
    setRecordChanges(subformChanges);
  };

  const renderItems = buildDataItems(
    recordChangeLogs,
    allFields,
    allAgencies,
    allLookups,
    locations,
    handleSeeDetails,
    i18n
  ).map(item => <ChangeLogItem item={item} key={item.key} />);

  return <Timeline classes={{ root: css.root }}>{renderItems}</Timeline>;
};

Component.displayName = NAME;

Component.propTypes = {
  allAgencies: PropTypes.array,
  allFields: PropTypes.object,
  allLookups: PropTypes.object,
  locations: PropTypes.array,
  recordChangeLogs: PropTypes.object,
  setCalculatingChangeLog: PropTypes.func,
  setOpen: PropTypes.func,
  setRecordChanges: PropTypes.func
};

export default Component;
