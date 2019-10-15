import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { IconButton, Paper } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { BarChart as BarChartGraphic, TableValues } from "components/charts";
import { selectLoading, selectErrors } from "components/index-table/selectors";
import TableChartIcon from "@material-ui/icons/TableChart";
import BarChartIcon from "@material-ui/icons/BarChart";
import { LoadingIndicator } from "components/loading-indicator";
import makeStyles from "@material-ui/styles/makeStyles";
import { useI18n } from "components/i18n";
import { PageContainer, PageContent, PageHeading } from "components/page";
import { buildDataForGraph, buildDataForTable } from "./helpers";
import { selectReport } from "./selectors";
import { fetchReport } from "./action-creators";
import namespace from "./namespace";
import styles from "./styles.css";

const Report = ({ match }) => {
  const css = makeStyles(styles)();
  const { params } = match;
  const i18n = useI18n();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReport(params.id));
  }, []);

  const errors = useSelector(state => selectErrors(state, namespace));
  const loading = useSelector(state => selectLoading(state, namespace));
  const report = useSelector(state => selectReport(state, params.id));

  const loadingIndicatorProps = {
    overlay: true,
    emptyMessage: i18n.t("report.no_data"),
    hasData: !!report.get("report_data", false),
    type: namespace,
    loading,
    errors
  };

  return (
    <PageContainer>
      <PageHeading
        title={report.get("name") ? report.get("name").get(i18n.locale) : ""}
      >
        <IconButton to="/reports" component={Link} className={css.exportButton}>
          <BarChartIcon />
        </IconButton>
        <IconButton to="/reports" component={Link} className={css.exportButton}>
          <TableChartIcon />
        </IconButton>
      </PageHeading>
      <PageContent>
        <LoadingIndicator {...loadingIndicatorProps}>
          {report.get("graph") && (
            <Paper>
              <BarChartGraphic
                {...buildDataForGraph(report, i18n)}
                showDetails
              />
            </Paper>
          )}
          <TableValues {...buildDataForTable(report, i18n)} />
        </LoadingIndicator>
      </PageContent>
    </PageContainer>
  );
};

Report.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Report);
