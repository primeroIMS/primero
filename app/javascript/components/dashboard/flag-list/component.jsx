import { NavLink } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../../i18n";
import { FlagBox } from "../flag-box";

import styles from "./styles.css";

const FlagList = ({ flags }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  return (
    <div>
      {(flags.get("flags") || []).map(flag => {
        return <FlagBox flag={flag} key={flag.get("id")} />;
      })}
      <NavLink to="/cases" className={css.seeAll}>
        {`${i18n.t("dashboard.link_see_all")} (${flags.get("totalCount")})`}
      </NavLink>
    </div>
  );
};

FlagList.displayName = "FlagList";

FlagList.propTypes = {
  flags: PropTypes.object
};

export default FlagList;
