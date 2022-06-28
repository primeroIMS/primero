import { Card, CardContent, List, ListItem, ListItemText } from "@material-ui/core";
import PropTypes from "prop-types";

import { getShortIdFromUniqueId } from "../../../records";
import css from "../../styles.css";
import { useI18n } from "../../../i18n";
import EmptyState from "../../../loading-indicator/components/empty-state";
import useOptions from "../../../form/use-options";
import { LOOKUPS } from "../../../../config";
import { getOptionText } from "../../../record-form/form/subforms/subform-traces/components/field-row/utils";

import indicatorCss from "./styles.css";

function Component({ subReportTitle, value, valueKey }) {
  const itemClasses = { primary: indicatorCss.listText };
  const i18n = useI18n();
  const genderLookups = useOptions({ source: LOOKUPS.gender_unknown });

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
            component="li"
            classes={{ divider: indicatorCss.listDivider, root: indicatorCss.listItem }}
            divider={index < value.size - 1}
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
                  getOptionText({ options: genderLookups, value: item.getIn(["data", "individual_sex"]) }),
                  item.getIn(["data", "individual_age"])
                ]
                  .filter(val => val)
                  .map(val => (
                    <span>{val}</span>
                  ))}
              </div>
            </ListItemText>
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
