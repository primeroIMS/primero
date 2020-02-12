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
import { LoadingIndicator } from "../../loading-indicator";
import NAMESPACE from "../../pages/dashboard/namespace";

import styles from "./styles.css";

const BadgedIndicator = ({
  data,
  lookup,
  sectionTitle,
  indicator,
  loading,
  errors
}) => {
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const loadingIndicatorProps = {
    overlay: true,
    hasData: Boolean(data.size),
    type: NAMESPACE,
    loading,
    errors
  };

  const dashboardChips = lookup.map(lk => {
    const value = data.getIn(["indicators", indicator, lk.id]);
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
      <LoadingIndicator {...loadingIndicatorProps}>
        {sectionTitle && <div className={css.sectionTitle}>{sectionTitle}</div>}
        <ul className={css.statusList} key={data.get("name")}>
          <ul>{dashboardChips}</ul>
        </ul>
      </LoadingIndicator>
    </>
  );
};

BadgedIndicator.displayName = "BadgedIndicator";

BadgedIndicator.propTypes = {
  data: PropTypes.object.isRequired,
  errors: PropTypes.bool,
  indicator: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  lookup: PropTypes.array.isRequired,
  sectionTitle: PropTypes.string
};

export default BadgedIndicator;
