import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";

import { useI18n } from "../../i18n";
import { PageContainer, PageHeading, PageContent } from "../../page";
import { getPermissions } from "../../user/selectors";
import { getLoading, getErrors } from "../../index-table";

import {
  Overview,
  SharedFromMyTeam,
  SharedWithMyTeam,
  WorkflowIndividualCases,
  Approvals,
  OverdueTasks,
  WorkflowTeamCases,
  ReportingLocation,
  ProtectionConcern
} from "./components";
import NAMESPACE from "./namespace";
import { NAME } from "./constants";
import * as actions from "./action-creators";

const Dashboard = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchDashboards());
  }, []);

  const userPermissions = useSelector(state => getPermissions(state));
  const loading = useSelector(state => getLoading(state, NAMESPACE));
  const errors = useSelector(state => getErrors(state, NAMESPACE));

  const indicatorProps = {
    overlay: true,
    type: NAMESPACE,
    loading,
    errors
  };

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.home")} />
      <PageContent>
        <Grid container spacing={3}>
          <Overview
            loadingIndicator={indicatorProps}
            userPermissions={userPermissions}
          />
          <SharedFromMyTeam loadingIndicator={indicatorProps} />
          <SharedWithMyTeam loadingIndicator={indicatorProps} />
          <WorkflowIndividualCases loadingIndicator={indicatorProps} />
          <Approvals loadingIndicator={indicatorProps} />
          <OverdueTasks loadingIndicator={indicatorProps} />
          <WorkflowTeamCases loadingIndicator={indicatorProps} />
          <ReportingLocation loadingIndicator={indicatorProps} />
          <ProtectionConcern loadingIndicator={indicatorProps} />
        </Grid>
      </PageContent>
    </PageContainer>
  );
};

Dashboard.displayName = NAME;

export default Dashboard;
