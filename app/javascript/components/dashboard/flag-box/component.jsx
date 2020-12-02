import PropTypes from "prop-types";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import generateKey from "../../charts/table-values/utils";

import FlagBoxItem from "./components/flag-box-item";
import styles from "./styles.css";

const FlagBox = ({ flags }) => {
  const css = makeStyles(styles)();

  return (
    <div className={css.flagContainer}>
      {flags.map(flag => {
        const showID = (flag.get("name").match(/\*/g) || []).length === 7;

        const flagBoxItemProps = {
          key: generateKey(),
          date: flag.get("date"),
          reason: flag.get("message"),
          recordId: flag.get("record_id"),
          title: showID ? flag.get("short_id") : flag.get("name"),
          user: flag.get("flagged_by")
        };

        return <FlagBoxItem {...flagBoxItemProps} />;
      })}
    </div>
  );
};

FlagBox.displayName = "FlagBox";

FlagBox.propTypes = {
  flags: PropTypes.object.isRequired
};

export default FlagBox;
