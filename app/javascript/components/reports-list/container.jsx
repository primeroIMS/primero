import { Card, CardContent, CardActionArea, TablePagination, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";

import DisableOffline from "../disable-offline";
import PageContainer, { PageHeading, PageContent } from "../page";
import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import { ROUTES } from "../../config";
import { usePermissions } from "../user";
import { CREATE_RECORDS } from "../../libs/permissions";
import { displayNameHelper, useMemoizedSelector, useThemeHelper } from "../../libs";
import { ROWS_PER_PAGE_OPTIONS } from "../../config/constants";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import { getMetadata } from "../record-list";
import { useMetadata } from "../records";

import { fetchReports } from "./action-creators";
import styles from "./styles.css";
import { selectReportsPagination, selectReports, selectLoading } from "./selectors";
import NAMESPACE from "./namespace";

const Reports = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { css } = useThemeHelper({ css: styles });

  const reports = useMemoizedSelector(state => selectReports(state));
  const isLoading = useMemoizedSelector(state => selectLoading(state));
  const reportsPagination = useMemoizedSelector(state => selectReportsPagination(state));
  const metadata = useMemoizedSelector(state => getMetadata(state, NAMESPACE));

  const canAddReport = usePermissions(NAMESPACE, CREATE_RECORDS);

  // const actionMenuItems = fromJS([
  //   {
  //     id: "add-new",
  //     label: "Add New",
  //     onClick: () => console.log("Add New")
  //   },
  //   {
  //     id: "arrange-items",
  //     label: "Arrange Items",
  //     onClick: () => console.log("Arrange Items")
  //   },
  //   {
  //     id: "refresh-data",
  //     label: "Refresh Data",
  //     onClick: () => console.log("Do Something")
  //   }
  // ]);

  useMetadata(NAMESPACE, metadata, fetchReports, "options");

  const paginationProps = {
    count: reportsPagination.get("total"),
    onChangePage: (e, page) => {
      dispatch(fetchReports({ options: { page: page + 1 } }));
    },
    page: reportsPagination.get("page") - 1,
    rowsPerPage: reportsPagination.get("per"),
    rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
    onChangeRowsPerPage: ({ target }) => dispatch(fetchReports({ options: { page: 1, per: target.value } })),
    component: "div"
  };

  const newReportBtn = canAddReport ? (
    <DisableOffline>
      <ActionButton
        icon={<AddIcon />}
        text={i18n.t("buttons.new")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          to: ROUTES.reports_new,
          component: Link
        }}
      />
    </DisableOffline>
  ) : null;

  return (
    <div>
      <PageContainer>
        <PageHeading title={i18n.t("reports.label")}>{newReportBtn}</PageHeading>
        <PageContent>
          <LoadingIndicator hasData={reports.size > 0} loading={isLoading} type="reports">
            <div className={css.reportsListContainer}>
              {reports.map(report => {
                return (
                  <DisableOffline>
                    <Card key={report.get("id")} className={css.card} elevation={3}>
                      <CardActionArea to={`/reports/${report.get("id")}`} component={Link} disableRipple>
                        <CardContent className={css.cardContent}>
                          <h3 className={css.title}>{displayNameHelper(report.get("name"), i18n.locale)}</h3>
                          <p className={css.description}>{displayNameHelper(report.get("description"), i18n.locale)}</p>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </DisableOffline>
                );
              })}
            </div>
            <Box display="flex" justifyContent="flex-end">
              <DisableOffline>
                <TablePagination {...paginationProps} />
              </DisableOffline>
            </Box>
          </LoadingIndicator>
        </PageContent>
      </PageContainer>
    </div>
  );
};

Reports.displayName = "Reports";

export default Reports;
