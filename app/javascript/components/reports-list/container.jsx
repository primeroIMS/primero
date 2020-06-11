import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  TablePagination,
  Box,
  Button
} from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@material-ui/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";

import { PageContainer, PageHeading, PageContent } from "../page";
import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import { ROUTES } from "../../config";
import { usePermissions } from "../user";
import { CREATE_RECORDS } from "../../libs/permissions";

import { fetchReports } from "./action-creators";
import styles from "./styles.css";
import {
  selectReportsPagination,
  selectReports,
  selectLoading
} from "./selectors";
import NAMESPACE from "./namespace";

const Reports = () => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const reports = useSelector(state => selectReports(state));
  const isLoading = useSelector(state => selectLoading(state));
  const reportsPagination = useSelector(state =>
    selectReportsPagination(state)
  );
  const canAddReport = usePermissions(NAMESPACE, CREATE_RECORDS);

  // const actionMenuItems = fromJS([
  //   {
  //     id: "add-new",
  //     label: "Add New",
  //     onClick: () => console.log("Do Something")
  //   },
  //   {
  //     id: "arrange-items",
  //     label: "Arrange Items",
  //     onClick: () => console.log("Do Something")
  //   },
  //   {
  //     id: "refresh-data",
  //     label: "Refresh Data",
  //     onClick: () => console.log("Do Something")
  //   }
  // ]);

  const defaultFilters = {
    page: 1,
    per: 20
  };

  useEffect(() => {
    dispatch(fetchReports({ options: defaultFilters }));
  }, []);

  const paginationProps = {
    count: reportsPagination.get("total"),
    onChangePage: (e, page) => {
      dispatch(fetchReports({ options: { page: page + 1 } }));
    },
    page: reportsPagination.get("page") - 1,
    rowsPerPage: reportsPagination.get("per"),
    rowsPerPageOptions: [20, 50, 75, 100],
    onChangeRowsPerPage: ({ target }) =>
      dispatch(fetchReports({ options: { page: 1, per: target.value } })),
    component: "div"
  };

  const newReportBtn = canAddReport ? (
    <Button
      to={ROUTES.reports_new}
      component={Link}
      color="primary"
      startIcon={<AddIcon />}
    >
      {i18n.t("buttons.new")}
    </Button>
  ) : null;

  return (
    <div>
      <PageContainer>
        <PageHeading title={i18n.t("reports.label")}>
          {newReportBtn}
        </PageHeading>
        <PageContent>
          <LoadingIndicator
            hasData={reports.size > 0}
            loading={isLoading}
            type="reports"
          >
            <div className={css.reportsListContainer}>
              {reports.map(report => {
                return (
                  <Card
                    key={report.get("id")}
                    className={css.card}
                    elevation={3}
                  >
                    <CardActionArea
                      to={`/reports/${report.get("id")}`}
                      component={Link}
                      disableRipple
                    >
                      <CardContent className={css.cardContent}>
                        <h3 className={css.title}>
                          {report.getIn(["name", i18n.locale], "")}
                        </h3>
                        <p className={css.description}>
                          {report.getIn(["description", i18n.locale], "")}
                        </p>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            </div>
            <Box display="flex" justifyContent="flex-end">
              <TablePagination {...paginationProps} />
            </Box>
          </LoadingIndicator>
        </PageContent>
      </PageContainer>
    </div>
  );
};

Reports.displayName = "Reports";

export default withRouter(Reports);
