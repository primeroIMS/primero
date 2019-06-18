import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { FlagBox } from "components/dashboard";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const FlagList = ({ flags, i18n }) => {
  const css = makeStyles(styles)();
  return (
    <div className={css.FlagList}>
      {flags.results.map(flag => {
        return <FlagBox flag={flag} key={flag.get("id")} />;
      })}
      <NavLink to="/cases" className={css.SeeAll}>
        {`${i18n.t("dashboard.link_see_all")} (${flags.totalCount})`}
      </NavLink>
    </div>
  );
};

FlagList.propTypes = {
  flags: PropTypes.object,
  i18n: PropTypes.object.isRequired
};

export default FlagList;
