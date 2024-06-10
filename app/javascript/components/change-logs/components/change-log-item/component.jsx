// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { ButtonBase } from "@mui/material";

import generateKey from "../../../charts/table-values/utils";
import { useI18n } from "../../../i18n";
import { DateCell } from "../../../index-table";
import css from "../../styles.css";

import { NAME } from "./constants";

const Component = ({ item }) => {
  const i18n = useI18n();
  const { onClick } = item;
  const renderMessage = change => (
    <div>
      <span className={css.detailName}>{change.name}</span>{" "}
      {change.from &&
        change.to &&
        `${i18n.t("change_logs.from")} "${change.from}" ${i18n.t("change_logs.to")} "${change.to}"`}
    </div>
  );
  const renderSeeDetail = item.isSubform && (
    <ButtonBase className={css.seeDetailsStyle} onClick={onClick} id="change_logs.see_details">
      {i18n.t("change_logs.see_details")}
    </ButtonBase>
  );
  const renderDetails =
    item.details &&
    item.details.map(detail => <li key={`change-log-details${generateKey()}`}>{renderMessage(detail)}</li>);

  const renderChange = item.change && renderMessage(item.change);

  return (
    <TimelineItem data-testid="timeline">
      <TimelineSeparator>
        <TimelineDot variant="outlined" color="primary" />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <div className={css.itemContainer}>
          <div className={css.itemHeader}>
            <DateCell value={item.date} withTime />
          </div>
          <div>
            {item.title} {renderSeeDetail}
          </div>
          <div>{renderChange}</div>
          <div>{item.user}</div>
          <div>
            <ul>{renderDetails}</ul>
          </div>
        </div>
      </TimelineContent>
    </TimelineItem>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  item: PropTypes.object.isRequired
};

export default Component;
