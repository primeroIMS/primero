/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Popover, Typography, Link } from "@material-ui/core";

import styles from "./styles.css";
import { GUIDING_QUESTIONS_NAME } from "./constants";

const GuidingQuestions = ({ label, text }) => {
  const css = makeStyles(styles)();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Link onClick={handleClick} className={css.link}>
        {label}
      </Link>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        className={css.root}
        PaperProps={{ className: css.content }}
      >
        <Typography>{text}</Typography>
      </Popover>
    </>
  );
};

GuidingQuestions.displayName = GUIDING_QUESTIONS_NAME;

GuidingQuestions.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default GuidingQuestions;
