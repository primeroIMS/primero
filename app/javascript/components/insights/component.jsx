// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams } from "react-router-dom";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import { MenuOpen } from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import { useI18n } from "../i18n";
import PageContainer, { PageContent, PageHeading } from "../page";
import { ROUTES } from "../../config";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import PageNavigation from "../page-navigation";
import ApplicationRoutes from "../application-routes";
import { getInsight, getSubReport } from "../insights-sub-report/selectors";
import ActionButton from "../action-button";
import { useDialog } from "../action-dialog";
import InsightsFilters from "../insights-filters";
import InsightFilterTags from "../insights-filters/components/insight-filter-tags";
import { clearFilters } from "../insights-list/action-creators";
import { selectInsightConfig } from "../insights-filters/utils";

import { NAME, INSIGHTS_EXPORTER_DIALOG, MANAGED_REPORTS, REPORTS } from "./constants";
import css from "./styles.css";
import InsightsExporter from "./components/insights-exporter";

function Component({ routes }) {
  const { id, moduleID } = useParams();
  const i18n = useI18n();
  const { pathname } = useLocation();
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const { setDialog, pending, dialogOpen, setDialogPending, dialogClose } = useDialog(INSIGHTS_EXPORTER_DIALOG);
  const dispatch = useDispatch();
  const [toggleNav, setToggleNav] = useState(false);

  const handleToggleNav = () => setToggleNav(!toggleNav);

  useEffect(() => {
    setToggleNav(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, []);

  const insight = useMemoizedSelector(state => getInsight(state));
  const subReport = useMemoizedSelector(state => getSubReport(state));

  const subReports = insight.get("subreports", fromJS([]));

  const insightType = selectInsightConfig(moduleID, id);

  const name = i18n.t(insight.get("name"));

  const menuList = subReports.map(subReportID => ({
    to: [ROUTES.insights, moduleID, id, subReportID].join("/"),
    text: i18n.t([MANAGED_REPORTS, id, REPORTS, subReportID].join("."))
  }));

  const subReportTitle = menuList.find(item => item.to === pathname)?.text;

  const handleExport = () => {
    setDialog({ dialog: INSIGHTS_EXPORTER_DIALOG, open: true });
  };

  return (
    <PageContainer twoCol>
      <PageHeading
        title={name}
        titleSecondary={<InsightFilterTags moduleID={moduleID} filters={insightType.filters} />}
        controls={toggleControls => {
          return <InsightsFilters moduleID={moduleID} id={id} toggleControls={toggleControls} subReport={subReport} />;
        }}
        icon={<FilterListIcon />}
      >
        <ActionButton onClick={handleExport} text="buttons.export" />
        <InsightsExporter
          i18n={i18n}
          subReport={subReport}
          open={dialogOpen}
          pending={pending}
          close={dialogClose}
          setPending={setDialogPending}
        />
      </PageHeading>
      <PageContent hasNav>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <div>
            <PageNavigation
              menuList={menuList}
              selected={pathname}
              mobileDisplay={mobileDisplay}
              handleToggleNav={handleToggleNav}
              toggleNav={toggleNav}
            />
          </div>
        </Box>
        <div>
          <div className={css.title}>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <div>
                <IconButton size="large" onClick={handleToggleNav}>
                  <MenuOpen />
                </IconButton>
              </div>
            </Box>
            <h2>{subReportTitle}</h2>
          </div>
          <ApplicationRoutes routes={routes} />
        </div>
      </PageContent>
    </PageContainer>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Component;
