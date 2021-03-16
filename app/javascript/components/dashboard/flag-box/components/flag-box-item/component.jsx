/* eslint-disable jsx-a11y/click-events-have-key-events */

import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";

import styles from "../../styles.css";
import { RECORD_PATH } from "../../../../../config";
import { UserArrowIcon } from "../../../../../images/primero-icons";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ date, reason, recordId, title, user }) => {
  const css = useStyles();
  const dispatch = useDispatch();
  const handleFlagOpen = id => () => dispatch(push(`${RECORD_PATH.cases}/${id}`));

  return (
    <div className={css.Flag} onClick={handleFlagOpen(recordId)} role="button" tabIndex="0">
      <h4 className={css.FlagTitle}>{title}</h4>
      <span className={css.FlagDate}>{date}</span>
      <p className={css.FlagContent}>{reason}</p>
      <span className={css.FlagStatus}>
        <UserArrowIcon className={css.FlagCasesMineIcon} />
        {user}
      </span>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  date: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
  recordId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired
};

export default Component;
