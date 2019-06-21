import React from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { withI18n } from "libs";
import { PrioritySummary } from "components/dashboard/priority-summary";
import { OptionsBox, ActionMenu } from "components/dashboard";
import { useTheme } from "@material-ui/core/styles";

const Services = ({ servicesList, i18n }) => {
  const theme = useTheme();
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
  const themeOverrides = {
    MuiCardHeader: {
      root: {
        padding: "0 16px 0 16px"
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
    <OptionsBox themes={themeOverrides}>
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
    </OptionsBox>
  );
};

Services.propTypes = {
  servicesList: PropTypes.object,
  i18n: PropTypes.object.isRequired
};

export default withI18n(Services);
