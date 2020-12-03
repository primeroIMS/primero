import React from "react";
import PropTypes from "prop-types";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ButtonBase } from "@material-ui/core";

import generateKey from "../../../charts/table-values/utils";
import { useI18n } from "../../../i18n";
import styles from "../../styles.css";

import { NAME } from "./constants";

const Component = ({ item }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const renderSeeDetail = item.isSubform && (
    <ButtonBase className={css.seeDetailsStyle} onClick={() => item.onClick()}>
      {i18n.t("change_logs.see_details")}
    </ButtonBase>
  );
  const renderDetails =
    item.details && item.details.map(detail => <div key={`change-log-details${generateKey()}`}>{detail}</div>);

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot variant="outlined" color="primary" />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <div className={css.itemContainer}>
          <div className={css.itemHeader}>{i18n.l("date.formats.with_time", item.date)}</div>
          <div>
            {item.title} {renderSeeDetail}
          </div>
          <div>{item.user}</div>
          <div className={css.itemDetails}>{renderDetails}</div>
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
