import PropTypes from "prop-types";
import { ListItem, ListItemText, Divider, makeStyles } from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";

import { UserArrowIcon } from "../../../../images/primero-icons";
import styles from "../styles.css";
import ListFlagsItemActions from "../list-flags-item-actions";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ flag }) => {
  const css = useStyles();
  const itemClass = flag?.removed ? css.itemResolved : css.item;

  if (!flag) {
    return null;
  }

  return (
    <>
      <ListItem className={itemClass}>
        <ListItemText className={css.itemText}>
          <div className={css.wrapper}>
            <div className={css.flagInfo}>
              <div className={css.elementContent}>
                <FlagIcon />
                <span>{flag.message}</span>
              </div>
              <div className={css.flagUser}>
                <UserArrowIcon className={css.rotateIcon} />
                <span>{flag.flagged_by}</span>
              </div>
            </div>
            <ListFlagsItemActions flag={flag} />
          </div>
        </ListItemText>
      </ListItem>
      <Divider component="li" />
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  flag: PropTypes.object.isRequired
};

export default Component;
