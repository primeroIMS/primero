import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import makeStyles from "@material-ui/styles/makeStyles";
import { push } from "connected-react-router";
import isEmpty from "lodash/isEmpty";

import { DashboardChip } from "../dashboard-chip";
import { useI18n } from "../../i18n";
import { ROUTES } from "../../../config";
import { buildFilter } from "../helpers";
import { INDICATOR_NAMES } from "../../pages/dashboard/constants";

import styles from "./styles.css";

const BadgedIndicator = ({ data, lookup, sectionTitle }) => {
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const i18n = useI18n();

  if (!data.size) {
    return null;
  }

  const dashboardChips = lookup.map(lk => {
    // TODO: A refactor might be needed.
    const value = data
      .get("indicators")
      .get(INDICATOR_NAMES.RISK_LEVEL)
      .get(lk.id);
    const countValue = value ? value.get("count") : 0;
    const queryValue = value ? value.get("query") : [];

    const handleClick = () => {
      if (!isEmpty(queryValue)) {
        dispatch(
          push({
            pathname: ROUTES.cases,
            search: buildFilter(queryValue)
          })
        );
      }
    };

    return (
      <li key={lk.id}>
        <DashboardChip
          label={`${countValue} ${lk.display_text[i18n.locale]}`}
          type={lk.id}
          handleClick={handleClick}
        />
      </li>
    );
  });

  return (
    <>
      {sectionTitle && <div className={css.sectionTitle}>{sectionTitle}</div>}
      <ul className={css.statusList} key={data.get("name")}>
        <ul>{dashboardChips}</ul>
      </ul>
    </>
  );
};

BadgedIndicator.displayName = "BadgedIndicator";

BadgedIndicator.propTypes = {
  data: PropTypes.object.isRequired,
  lookup: PropTypes.array.isRequired,
  sectionTitle: PropTypes.string
};

export default BadgedIndicator;
