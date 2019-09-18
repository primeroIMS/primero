import React, { useEffect } from "react";
import { connect, batch } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { Grid, Box, IconButton } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { OptionsBox, ActionMenu } from "components/dashboard";
import AddIcon from "@material-ui/icons/Add";
import { PageContainer } from "components/page-container";
import makeStyles from "@material-ui/styles/makeStyles";
import { useI18n } from "components/i18n";
import * as actions from "./action-creators";
import * as selectors from "./selectors";
import styles from "./styles.css";

const Reports = ({ fetchReports, reports }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const actionMenuItems = fromJS([
    {
      id: "add-new",
      label: "Add New",
      onClick: () => console.log("Do Something")
    },
    {
      id: "arrange-items",
      label: "Arrange Items",
      onClick: () => console.log("Do Something")
    },
    {
      id: "refresh-data",
      label: "Refresh Data",
      onClick: () => console.log("Do Something")
    }
  ]);

  useEffect(() => {
    batch(() => {
      fetchReports({});
    });
  }, []);

  return (
    <div>
      <PageContainer>
        <Grid item xs={12}>
          <Box alignItems="center" display="flex">
            <Box flexGrow={1}>
              <h1 className={css.title}>{i18n.t("reports.label")}</h1>
            </Box>
            <Box>
              <IconButton to="/reports" component={Link} className={css.new}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={12}>
            {reports.map(report => (
              <OptionsBox
                key={report.id}
                title={report.name[i18n.locale]}
                to={`reports/${report.id}`}
                action={<ActionMenu open={false} items={actionMenuItems} />}
              >
                <div className={css.reportDescription}>
                  {report.description[i18n.locale]}
                </div>
              </OptionsBox>
            ))}
          </Grid>
        </Grid>
      </PageContainer>
    </div>
  );
};

Reports.propTypes = {
  fetchReports: PropTypes.func,
  reports: PropTypes.object
};

const mapStateToProps = state => {
  return {
    reports: selectors.selectReports(state)
  };
};

const mapDispatchToProps = {
  fetchReports: actions.fetchReports
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Reports)
);
