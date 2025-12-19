// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Card, CardContent, List } from "@mui/material";
import PropTypes from "prop-types";

import css from "../../styles.css";
import { useI18n } from "../../../i18n";
import EmptyState from "../../../loading-indicator/components/empty-state";

import MultipleViolationsVictim from "./multiple-violations-victim";
import IndividualVictim from "./individual-victim";
import GroupVictim from "./group-victim";
import indicatorCss from "./styles.css";

function Component({ indicatorKey, subReportTitle, value }) {
  const i18n = useI18n();
  const isGroupVictim = indicatorKey === "group_multiple_violations";
  const renderVictim = data => (isGroupVictim ? <GroupVictim data={data} /> : <IndividualVictim data={data} />);

  if (value.isEmpty()) {
    return (
      <>
        <h3 className={css.sectionTitle}>{subReportTitle}</h3>
        <Card>
          <CardContent>
            <EmptyState emptyMessage={i18n.t("managed_reports.no_data_table")} type="insights" />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className={css.section}>
      <h3 className={css.sectionTitle}>{subReportTitle}</h3>
      <List dense disablePadding classes={{ root: indicatorCss.list }}>
        {value.map((item, index) => (
          <MultipleViolationsVictim
            key={item.getIn(["data", "unique_id"])}
            data={item}
            divider={index < value.size - 1}
            renderVictim={renderVictim}
          />
        ))}
      </List>
    </div>
  );
}

Component.displayName = "MultipleViolationsIndicator";

Component.propTypes = {
  indicatorKey: PropTypes.string,
  subReportTitle: PropTypes.string,
  value: PropTypes.object
};

export default Component;
