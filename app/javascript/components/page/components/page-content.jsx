import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import styles from "../styles.css";

const useStyles = makeStyles(styles);

const PageContent = ({ children }) => {
  const css = useStyles();

  return <div className={css.content}>{children}</div>;
};

PageContent.propTypes = {
  children: PropTypes.node
};

PageContent.displayName = "PageContent";

export default PageContent;
