import React from "react";
import PropTypes from "prop-types";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { useI18n } from "../../../../i18n";
import styles from "../../styles.css";

import { NAME } from "./constants";

const Component = ({ changeLogDate, changeLogMessage, changeLogUser }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <div className={css.itemContainer}>
          <div className={css.itemHeader}>
            {i18n.l("date.formats.with_time", changeLogDate)}
          </div>
          <div>{changeLogMessage}</div>
          <div>{changeLogUser}</div>
        </div>
      </TimelineContent>
    </TimelineItem>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  changeLogDate: PropTypes.string,
  changeLogMessage: PropTypes.string,
  changeLogUser: PropTypes.string
};

export default Component;
