// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import Timeline from "@mui/lab/Timeline";

import { useI18n } from "../../../i18n";
import ChangeLogItem from "../change-log-item";
import { buildDataItems } from "../../utils";
import css from "../../styles.css";

import { NAME } from "./constants";

function Component({
  recordChangeLogs,
  setOpen,
  setRecordChanges,
  setCalculatingChangeLog,
  allFields,
  allLookups,
  locations,
  allAgencies
}) {
  const i18n = useI18n();

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
}

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
