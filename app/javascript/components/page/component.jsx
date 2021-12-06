import PropTypes from "prop-types";

import { useThemeHelper } from "../../libs";

import css from "./styles.css";

const Component = ({ children, twoCol, fullWidthMobile }) => {
  const { mobileDisplay } = useThemeHelper();

  const contentContainer = fullWidthMobile && mobileDisplay ? css.noWrap : css.wrap;

  if (twoCol) {
    return <div className={css.twoCol}>{children}</div>;
  }

  return (
    <div className={css.root}>
      <div className={contentContainer}>{children}</div>
    </div>
  );
};

Component.displayName = "PageContainer";

Component.defaultProps = {
  fullWidthMobile: false
};

Component.propTypes = {
  children: PropTypes.node.isRequired,
  fullWidthMobile: PropTypes.bool,
  twoCol: PropTypes.bool
};

export default Component;
