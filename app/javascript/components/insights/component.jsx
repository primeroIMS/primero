import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useLocation, useParams } from "react-router-dom";
import { Hidden, IconButton, useMediaQuery } from "@material-ui/core";
import { MenuOpen } from "@material-ui/icons";

import { useI18n } from "../i18n";
import PageContainer, { PageContent, PageHeading } from "../page";
import { ROUTES } from "../../config";
import { displayNameHelper, useMemoizedSelector } from "../../libs";
import { clearSelectedReport } from "../reports-form/action-creators";
import PageNavigation from "../page-navigation";
import ApplicationRoutes from "../application-routes";
import InsightsFilters from "../insights-filters";

import { getInsight } from "./selectors";
import { fetchReport } from "./action-creators";
import { INSIGHTS_CONFIG, NAME } from "./constants";
import Exporter from "./components/exporter";
import css from "./styles.css";

const Component = ({ routes }) => {
  const { id } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const [toggleNav, setToggleNav] = useState(false);

  const handleToggleNav = () => setToggleNav(!toggleNav);

  useEffect(() => {
    dispatch(fetchReport(id));

    return () => {
      dispatch(clearSelectedReport());
    };
  }, []);

  useEffect(() => {
    setToggleNav(false);
  }, [pathname]);

  const insightType = INSIGHTS_CONFIG.mrm;

  const menuList = insightType.ids.map(violation => ({
    to: `${ROUTES.insights}/${id}/${violation}`,
    text: i18n.t([...insightType.localeKeys, violation].join("."))
  }));

  const report = useMemoizedSelector(state => getInsight(state));

  const name = displayNameHelper(report.get("name"), i18n.locale);

  const subReportTitle = menuList.find(item => item.to === pathname)?.text;

  return (
    <PageContainer twoCol>
      <PageHeading title={name}>
        <Exporter includesGraph={report.get("graph")} />
      </PageHeading>
      <PageContent hasNav>
        <Hidden smDown implementation="css">
          <div>
            <PageNavigation
              menuList={menuList}
              selected={pathname}
              mobileDisplay={mobileDisplay}
              handleToggleNav={handleToggleNav}
              toggleNav={toggleNav}
            />
          </div>
        </Hidden>
        <div>
          <div className={css.title}>
            <Hidden mdUp implementation="css">
              <div>
                <IconButton onClick={handleToggleNav}>
                  <MenuOpen />
                </IconButton>
              </div>
            </Hidden>
            <h2>{subReportTitle}</h2>
          </div>
          <InsightsFilters />
          <ApplicationRoutes routes={routes} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Component;
