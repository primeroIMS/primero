import { fromJS } from "immutable";
import PropTypes from "prop-types";
import React from "react";
import { useTheme } from "@material-ui/styles";

import { PrioritySummary } from "../priority-summary";
import { useI18n } from "../../i18n";
import { OptionsBox } from "../options-box";
import { ActionMenu } from "../action-menu";

const Services = ({ servicesList }) => {
  const theme = useTheme();
  const i18n = useI18n();

  const styleOverrides = {
    CardShadow: { boxShadow: "none" },
    OptionsBox: {
      borderTop: `1px solid ${theme.primero.colors.lightGrey}`,
      borderRadius: 0,
      "&:first-child": {
        borderTop: "none"
      }
    }
  };

  const caseManagement = servicesList.get("caseManagement") || [];
  const screening = servicesList.get("screening") || [];
  const actionMenuItems = fromJS([
    {
      id: "add-new",
      label: "Add New"
    }
  ]);

  return (
    <>
      <OptionsBox
        classes={styleOverrides}
        title={i18n.t("dashboard.case_management_service")}
        action={<ActionMenu open={false} items={actionMenuItems} />}
      >
        {caseManagement.map(summary => {
          return (
            <PrioritySummary key={summary.get("status")} summary={summary} />
          );
        })}
      </OptionsBox>

      <OptionsBox
        title={i18n.t("dashboard.screening_service")}
        classes={styleOverrides}
        action={<ActionMenu open={false} items={actionMenuItems} />}
      >
        {screening.map(summary => {
          return (
            <PrioritySummary key={summary.get("status")} summary={summary} />
          );
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
