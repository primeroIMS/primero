import PropTypes from "prop-types";

import PrioritySummary from "../priority-summary";
import { useI18n } from "../../i18n";
import OptionsBox from "../options-box";

import css from "./styles.css";

const Services = ({ servicesList }) => {
  const i18n = useI18n();

  const styleOverrides = {
    CardShadow: css.cardShadow,
    OptionsBox: css.optionsBox
  };

  const caseManagement = servicesList.get("caseManagement") || [];
  const screening = servicesList.get("screening") || [];

  return (
    <>
      <OptionsBox classes={styleOverrides} title={i18n.t("dashboard.case_management_service")}>
        {caseManagement.map(summary => {
          return <PrioritySummary key={summary.get("status")} summary={summary} />;
        })}
      </OptionsBox>

      <OptionsBox title={i18n.t("dashboard.screening_service")} classes={styleOverrides}>
        {screening.map(summary => {
          return <PrioritySummary key={summary.get("status")} summary={summary} />;
        })}
      </OptionsBox>
    </>
  );
};

Services.displayName = "Services";

Services.propTypes = {
  servicesList: PropTypes.object
};

export default Services;
