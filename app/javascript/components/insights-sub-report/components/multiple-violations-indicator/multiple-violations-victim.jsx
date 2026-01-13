// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { ListItem, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

import { useI18n } from "../../../i18n";
import { RECORD_TYPES_PLURAL } from "../../../../config";

import indicatorCss from "./styles.css";

function Component({ data, divider, renderVictim }) {
  const i18n = useI18n();
  const itemClasses = { root: indicatorCss.listText };

  return (
    <NavLink to={`/${RECORD_TYPES_PLURAL.incident}/${data.getIn(["data", "incident_id"])}`}>
      <ListItem
        component="li"
        classes={{ divider: indicatorCss.listDivider, root: indicatorCss.listItem }}
        divider={divider}
      >
        <Typography component="div" classes={itemClasses}>
          {renderVictim(data.get("data"))}
          <div className={indicatorCss.listIncident}>
            <h4 className={indicatorCss.secondaryTitle}>{i18n.t("incident.violation.associated_violations")}</h4>
            <ul className={indicatorCss.secondaryList}>
              {data.getIn(["data", "violations"], []).map(violation => (
                <li key={violation}>{i18n.t(["incident.violation.types", violation].join("."))}</li>
              ))}
            </ul>
            <h4 className={indicatorCss.secondaryTitle}>{`Incident: ${data.getIn(["data", "incident_short_id"])}`}</h4>
          </div>
        </Typography>
      </ListItem>
    </NavLink>
  );
}

Component.displayName = "MultipleViolationsVictim";

Component.propTypes = {
  data: PropTypes.object,
  divider: PropTypes.bool,
  renderVictim: PropTypes.func
};

export default Component;
