import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ percentage, className }) => {
  const css = useStyles();

  const percentageValue = percentage * 100;
  const isSmall = percentage < 0.1;

  const containerClasses = [css.TablePercentageBarContainer, className].join(" ");
  const foregroundClasses = [css.TablePercentageBarComplete, (isSmall && css.small) || ""].join(" ");
  const style = { width: `${percentageValue}%` };

  return (
    <div className={containerClasses}>
      <div className={css.TablePercentageBar}>
        {isSmall && `${percentageValue.toFixed(0)}%`}
        <div className={foregroundClasses} style={style}>
          {!isSmall && `${percentageValue.toFixed(0)}%`}
        </div>
      </div>
    </div>
  );
};

Component.displayName = "TablePercentageBar";

Component.propTypes = {
  className: PropTypes.string,
  percentage: PropTypes.number
};

export default Component;
