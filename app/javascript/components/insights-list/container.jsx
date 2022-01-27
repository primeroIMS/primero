import { List, ListItem, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";

import DisableOffline from "../disable-offline";
import PageContainer, { PageHeading, PageContent } from "../page";
import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import { displayNameHelper, useMemoizedSelector } from "../../libs";
import { getMetadata } from "../record-list";
import { useMetadata } from "../records";
import { ROUTES } from "../../config";
import { INSIGHTS_CONFIG } from "../insights/constants";

import { fetchReports } from "./action-creators";
import css from "./styles.css";
import { selectInsights, selectLoading } from "./selectors";
import NAMESPACE from "./namespace";

const Container = () => {
  const i18n = useI18n();

  const reports = useMemoizedSelector(state => selectInsights(state));
  const isLoading = useMemoizedSelector(state => selectLoading(state));
  const metadata = useMemoizedSelector(state => getMetadata(state, NAMESPACE));

  useMetadata(NAMESPACE, metadata, fetchReports, "options");

  return (
    <div>
      <PageContainer>
        <PageHeading title={i18n.t("insights.label")} />
        <PageContent>
          <LoadingIndicator hasData={reports.size > 0} loading={isLoading} type="reports">
            <List dense>
              {reports.map((report, index) => {
                return (
                  <ListItem
                    key={report.get("id")}
                    to={`${ROUTES.insights}/${report.get("id")}/${INSIGHTS_CONFIG.mrm.ids[0]}`}
                    button
                    component={Link}
                    divider={index < reports.size - 1}
                    classes={{ root: css.listBtn }}
                  >
                    <ListItemText secondary={displayNameHelper(report.get("description"), i18n.locale)}>
                      <DisableOffline>
                        <h3 className={css.title}>{displayNameHelper(report.get("name"), i18n.locale)}</h3>
                      </DisableOffline>
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </LoadingIndicator>
        </PageContent>
      </PageContainer>
    </div>
  );
};

Container.displayName = "InsightsList";

export default Container;
