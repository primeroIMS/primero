import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

import generateKey from "../../charts/table-values/utils";

import FlagBoxItem from "./components/flag-box-item";
import { showId } from "./utils";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const FlagBox = ({ flags }) => {
  const css = useStyles();

  return (
    <div className={css.flagContainer}>
      {flags
        .map(flag => (
          <FlagBoxItem
            key={generateKey()}
            date={flag.get("date")}
            reason={flag.get("message")}
            recordId={flag.get("record_id")}
            title={showId(flag) ? flag.get("short_id") : flag.get("name")}
            user={flag.get("flagged_by")}
          />
        ))
        .slice(0, 10)}
    </div>
  );
};

FlagBox.displayName = "FlagBox";

FlagBox.propTypes = {
  flags: PropTypes.object.isRequired
};

export default FlagBox;
