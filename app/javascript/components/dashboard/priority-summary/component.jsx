import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { useI18n } from "../../i18n";
import DashboardChip from "../dashboard-chip";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const PrioritySummary = ({ summary }) => {
  const css = useStyles();
  const i18n = useI18n();

  const getTitle = status => {
    switch (status) {
      case "in_progress":
        return i18n.t(`dashboard.in_progress`);
      case "near_deadline":
        return i18n.t(`dashboard.near_deadline`);
      case "overdue":
        return i18n.t(`dashboard.due`);
      default:
        return "";
    }
  };

  return (
    <div className={css.StatusList} key={summary.get("status")}>
      <h5>{getTitle(summary.get("status"))}</h5>
      <ul>
        <li>
          <DashboardChip
            label={`${summary.get("high")}
                    ${i18n.t("dashboard.high_level")}`}
            type="high"
          />
        </li>
        <li>
          <DashboardChip
            label={`${summary.get("medium")}
                    ${i18n.t("dashboard.medium_level")}`}
            type="medium"
          />
        </li>
        <li>
          <DashboardChip
            label={`${summary.get("low")}
                    ${i18n.t("dashboard.low_level")}`}
            type="low"
          />
        </li>
      </ul>
    </div>
  );
};

PrioritySummary.displayName = "PrioritySummary";

PrioritySummary.propTypes = {
  summary: PropTypes.object
};

export default PrioritySummary;
