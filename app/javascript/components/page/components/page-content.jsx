import PropTypes from "prop-types";


import css from "../styles.css";



const PageContent = ({ children }) => {
  

  return <div className={css.content}>{children}</div>;
};

PageContent.propTypes = {
  children: PropTypes.node
};

PageContent.displayName = "PageContent";

export default PageContent;
