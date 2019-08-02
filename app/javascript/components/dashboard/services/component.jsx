import React from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useI18n } from "components/i18n";
import { PrioritySummary } from "components/dashboard/priority-summary";
import { OptionsBox, ActionMenu } from "components/dashboard";
import { useTheme } from "@material-ui/styles";

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

Services.propTypes = {
  servicesList: PropTypes.object
};

export default Services;
