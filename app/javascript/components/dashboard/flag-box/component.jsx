import React from "react";
import PropTypes from "prop-types";
import { CasesMineIcon } from "images/primero-icons";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const FlagBox = ({ flag }) => {
  const css = makeStyles(styles)();
  return (
    <div className={css.Flag}>
      <h4 className={css.FlagTitle}>{flag.id}</h4>
      <span className={css.FlagDate}>{flag.flag_date}</span>
      <p className={css.FlagContent}>{flag.user}</p>
      <span className={css.FlagStatus}>
        {/* TODO: This icon should change depending on the status */}
        <CasesMineIcon className={css.FlagCasesMineIcon} />
        {flag.status}
      </span>
    </div>
  );
};

FlagBox.propTypes = {
  flag: PropTypes.object.isRequired
};

export default FlagBox;
