import { Card, CardContent, List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import PropTypes from "prop-types";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

import { useThemeHelper } from "../../../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import { getShortIdFromUniqueId } from "../../../records";
import css from "../../styles.css";
import { useI18n } from "../../../i18n";
import EmptyState from "../../../loading-indicator/components/empty-state";

import indicatorCss from "./styles.css";

function Component({ subReportTitle, value, valueKey }) {
  const { isRTL } = useThemeHelper();
  const itemClasses = { primary: indicatorCss.listText };
  const i18n = useI18n();
  const handleClickThru = () => {};

  if (value.isEmpty()) {
    return (
      <>
        <h3 className={css.sectionTitle}>{subReportTitle(valueKey)}</h3>
        <Card>
          <CardContent>
            <EmptyState emptyMessage={i18n.t("managed_reports.no_data_table")} type="insights" />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className={css.section}>
      <h3 className={css.sectionTitle}>{subReportTitle(valueKey)}</h3>
      <List dense disablePadding classes={{ root: indicatorCss.list }}>
        {value.map((item, index) => (
          <ListItem
            component="a"
            classes={{ divider: indicatorCss.listDivider, root: indicatorCss.listItem }}
            divider={index < value.length - 1}
          >
            <ListItemText
              classes={itemClasses}
              secondary={
                <>
                  <h4 className={indicatorCss.secondaryTitle}>{i18n.t("incident.violation.associated_violations")}</h4>
                  <ul className={indicatorCss.secondaryList}>
                    {item.getIn(["data", "violations"], []).map(violation => (
                      <li>{i18n.t(["incident.violation.types", violation].join("."))}</li>
                    ))}
                  </ul>
                </>
              }
            >
              <div className={indicatorCss.listItemText}>
                {[
                  getShortIdFromUniqueId(item.getIn(["data", "unique_id"])),
                  item.getIn(["data", "individual_sex"]),
                  item.getIn(["data", "individual_age"])
                ]
                  .filter(val => val)
                  .map(val => (
                    <span>{val}</span>
                  ))}
              </div>
            </ListItemText>
            <ListItemSecondaryAction classes={{ root: indicatorCss.listActions }}>
              <ActionButton
                icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                type={ACTION_BUTTON_TYPES.icon}
                rest={{
                  className: css.subformShow,
                  onClick: handleClickThru()
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

Component.displayName = "MultipleViolationsIndicator";

Component.propTypes = {
  subReportTitle: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueKey: PropTypes.string
};

export default Component;
