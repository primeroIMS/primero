import PropTypes from "prop-types";
import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";

import { CasesMineIcon } from "../../../images/primero-icons";

import styles from "./styles.css";

const FlagBox = ({ flag }) => {
  const css = makeStyles(styles)();

  return (
    <div className={css.Flag}>
      <h4 className={css.FlagTitle}>{flag.get("id")}</h4>
      <span className={css.FlagDate}>{flag.get("flag_date")}</span>
      <p className={css.FlagContent}>{flag.get("user")}</p>
      <span className={css.FlagStatus}>
        {/* TODO: This icon should change depending on the status */}
        <CasesMineIcon className={css.FlagCasesMineIcon} />
        {flag.get("status")}
      </span>
    </div>
  );
};

FlagBox.displayName = "FlagBox";

FlagBox.propTypes = {
  flag: PropTypes.object.isRequired
};

export default FlagBox;
