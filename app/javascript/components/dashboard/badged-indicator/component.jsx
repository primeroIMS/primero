import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import makeStyles from "@material-ui/styles/makeStyles";
import { push } from "connected-react-router";

import { DashboardChip } from "../dashboard-chip";
import { useI18n } from "../../i18n";
import { setDashboardFilters } from "../../filters-builder/action-creators";
import { ROUTES, RECORD_PATH } from "../../../config";
import { FROM_DASHBOARD_PARAMS } from "../constants";
import { buildFilter } from "../helpers";

import styles from "./styles.css";

const BadgedIndicator = ({ data, lookup }) => {
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const i18n = useI18n();

  if (!data.size) {
    return null;
  }

  const dashboardChips = lookup.map(lk => {
    const value = data.get("stats").get(lk.id);
    const countValue = value ? value.get("count") : 0;
    const queryValue = value ? value.get("query") : [];

    const handlerClick = () => {
      dispatch(setDashboardFilters(RECORD_PATH.cases, buildFilter(queryValue)));
      dispatch(
        push({
          pathname: ROUTES.cases,
          search: FROM_DASHBOARD_PARAMS
        })
      );
    };

    return (
      <li key={lk.id}>
        <DashboardChip
          label={`${countValue} ${lk.display_text[i18n.locale]}`}
          type={lk.id}
          handleClick={handlerClick}
        />
      </li>
    );
  });

  return (
    <>
      <ul className={css.statusList} key={data.get("name")}>
        <ul>{dashboardChips}</ul>
      </ul>
    </>
  );
};

BadgedIndicator.displayName = "BadgedIndicator";

BadgedIndicator.propTypes = {
  data: PropTypes.object.isRequired,
  lookup: PropTypes.array.isRequired
};

export default BadgedIndicator;
