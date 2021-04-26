import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { useI18n } from "../../i18n";
import FlagBox from "../flag-box";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const FlagList = ({ flags }) => {
  const css = useStyles();
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
