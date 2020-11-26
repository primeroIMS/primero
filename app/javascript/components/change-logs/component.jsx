import React from "react";
import PropTypes from "prop-types";
import Timeline from "@material-ui/lab/Timeline";
import { useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { NAME } from "./constants";
import { getChangeLogs } from "./selectors";
import styles from "./styles.css";
import ChangeLogItems from "./components/change-log-items";

const Component = ({ record, recordType }) => {
  const css = makeStyles(styles)();
  const recordChangeLogs = useSelector(state => getChangeLogs(state, record?.get("id"), recordType));

  return (
    <div className={css.container}>
      <Timeline classes={{ root: css.root }}>
        <ChangeLogItems recordChangeLogs={recordChangeLogs} />
      </Timeline>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
