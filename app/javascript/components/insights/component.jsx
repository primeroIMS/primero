import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams } from "react-router-dom";
import { Hidden, IconButton, useMediaQuery } from "@material-ui/core";
import { MenuOpen } from "@material-ui/icons";

import { useI18n } from "../i18n";
import PageContainer, { PageContent, PageHeading } from "../page";
import { MODULES, ROUTES } from "../../config";
import { useMemoizedSelector } from "../../libs";
import PageNavigation from "../page-navigation";
import ApplicationRoutes from "../application-routes";
import { getInsight } from "../insights-sub-report/selectors";

import { INSIGHTS_CONFIG, NAME } from "./constants";
import css from "./styles.css";

const Component = ({ routes }) => {
  const { id } = useParams();
  const i18n = useI18n();
  const { pathname } = useLocation();
  const { moduleID } = useParams();
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const [toggleNav, setToggleNav] = useState(false);

  const handleToggleNav = () => setToggleNav(!toggleNav);

  useEffect(() => {
    setToggleNav(false);
  }, [pathname]);

  const insightType = INSIGHTS_CONFIG[moduleID];

  const menuList = insightType.ids.map(subReportID => ({
    to: [ROUTES.insights, moduleID, id, subReportID].join("/"),
    text: i18n.t([...insightType.localeKeys, subReportID].join("."))
  }));

  const insight = useMemoizedSelector(state => getInsight(state));

  const name = i18n.t(insight.get("name"));

  const subReportTitle = menuList.find(item => item.to === pathname)?.text;

  // TODO: Remove when added to api
  const tempAdditionalMenuList =
    moduleID === MODULES.GBV
      ? [
          {
            text: "Survivor",
            disabled: true
          },
          {
            text: "Perpetrator",
            disabled: true
          }
        ]
      : [];

  return (
    <PageContainer twoCol>
      <PageHeading title={name}>{/* <Exporter includesGraph={insight.get("graph")} /> */}</PageHeading>
      <PageContent hasNav>
        <Hidden smDown implementation="css">
          <div>
            <PageNavigation
              menuList={[...menuList, ...tempAdditionalMenuList]}
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
