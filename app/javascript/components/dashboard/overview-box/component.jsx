// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment } from "react";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { ROUTES } from "../../../config";
import { buildFilter } from "../utils";
import DoughnutChart from "../doughnut-chart";
import { useI18n } from "../../i18n";
import LoadingIndicator from "../../loading-indicator";
import NAMESPACE from "../../pages/dashboard/namespace";
import { useApp } from "../../application";
import ActionButton from "../../action-button";

import css from "./styles.css";

const OverviewBox = ({ items, chartData, sumTitle, withTotal = true, loading, errors }) => {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const dispatch = useDispatch();
  const indicators = items.get("indicators", fromJS({}));
  const indicatorsKeys = indicators.keySeq();

  const loadingIndicatorProps = {
    overlay: true,
    hasData: indicators.size > 1,
    type: NAMESPACE,
    loading,
    errors
  };

  const sum = () => {
    return indicatorsKeys.reduce((prev, current) => prev + (indicators.getIn([current, "count"]) || 0), 0);
  };

  const handleClick = query => {
    dispatch(
      push({
        pathname: ROUTES.cases,
        search: buildFilter(query)
      })
    );
  };

  const buildLabelItem = item => {
    switch (item) {
      case "approval_assessment_pending_group":
        return approvalsLabels.get("assessment");
      case "approval_case_plan_pending_group":
        return approvalsLabels.get("case_plan");
      case "approval_closure_pending_group":
        return approvalsLabels.get("closure");
      case "approval_action_plan_pending_group":
        return approvalsLabels.get("action_plan");
      case "approval_gbv_closure_pending_group":
        return approvalsLabels.get("gbv_closure");
      default:
        return i18n.t(`dashboard.${item}`);
    }
  };

  const statItems = () => {
    const handleButtonClick = query => () => handleClick(query);

    return indicators.keySeq().map(item => {
      return (
        <Fragment key={item}>
          <ActionButton
            id={`overview-${item}-number`}
            className={css.itemButtonNumber}
            type="link"
            text={indicators.getIn([item, "count"])}
            onClick={handleButtonClick(indicators.getIn([item, "query"], []))}
            noTranslate
          />
          <ActionButton
            id={`overview-${item}-text`}
            className={css.itemButton}
            type="link"
            text={buildLabelItem(item)}
            onClick={handleButtonClick(indicators.getIn([item, "query"], []))}
            noTranslate
          />
        </Fragment>
      );
    });
  };

  const renderSum = () => {
    return withTotal ? `${sum()} ${sumTitle}` : sumTitle;
  };

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const renderItems = () => (
    <LoadingIndicator {...loadingIndicatorProps}>
      <div className={css.overviewBox} data-testid="overview-box">
        <div className={css.sectionTitle}>{renderSum()}</div>
        <div className={css.overviewList}>{statItems()}</div>
      </div>
    </LoadingIndicator>
  );

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const renderWithChart = () => (
    <div className={css.root} data-testid="overview-box">
      <Grid container spacing={3}>
        {chartData && (
          <Grid item md={4} xs={12} className={css.dashboardChart}>
            <DoughnutChart chartData={chartData} />
          </Grid>
        )}
        <Grid item md={8} xs={12}>
          {renderItems()}
        </Grid>
      </Grid>
    </div>
  );

  const renderOverviewBox = chartData ? renderWithChart() : renderItems();

  return <>{renderOverviewBox}</>;
};

OverviewBox.displayName = "OverviewBox";

OverviewBox.propTypes = {
  chartData: PropTypes.object,
  errors: PropTypes.bool,
  items: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  sumTitle: PropTypes.string,
  withTotal: PropTypes.bool
};

export default OverviewBox;
