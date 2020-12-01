/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";

import { UserArrowIcon } from "../../../images/primero-icons";
import { RECORD_PATH } from "../../../config";

import styles from "./styles.css";

const FlagBox = ({ flag }) => {
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const showID = (flag.get("name").match(/\*/g) || []).length === 7;
  const title = showID ? flag.get("short_id") : flag.get("name");

  const onClickFlag = id => () => dispatch(push(`${RECORD_PATH.cases}/${id}`));

  return (
    <div className={css.Flag} onClick={onClickFlag(flag.get("record_id"))} role="button" tabIndex="0">
      <h4 className={css.FlagTitle}>{title}</h4>
      <span className={css.FlagDate}>{flag.get("date")}</span>
      <p className={css.FlagContent}>{flag.get("message")}</p>
      <span className={css.FlagStatus}>
        <UserArrowIcon className={css.FlagCasesMineIcon} />
        {flag.get("flagged_by")}
      </span>
    </div>
  );
};

FlagBox.displayName = "FlagBox";

FlagBox.propTypes = {
  flag: PropTypes.object.isRequired
};

export default FlagBox;
