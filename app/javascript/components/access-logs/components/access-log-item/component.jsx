// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import { useI18n } from "../../../i18n";
import { DateCell } from "../../../index-table";
import css from "../../styles.css";

import { NAME } from "./constants";

function Component({ item }) {
  const i18n = useI18n();

  return (
    <TimelineItem data-testid="timeline">
      <TimelineSeparator>
        <TimelineDot variant="outlined" color="primary" />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <div className={css.itemContainer}>
          <div className={css.itemHeader}>
            <DateCell value={item.get("timestamp")} withTime />
          </div>
          <div>{i18n.t(`access_log.${item.get("action")}`)}</div>
          <div>{`${item.get("full_name")} (${item.get("user_name")}), ${item.get("role_name")}`}</div>
        </div>
      </TimelineContent>
    </TimelineItem>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  item: PropTypes.object.isRequired
};

export default Component;
