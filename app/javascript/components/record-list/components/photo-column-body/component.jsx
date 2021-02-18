import PropTypes from "prop-types";

import { ToggleIconCell } from "../../../index-table";
import Lightbox from "../../../lightbox";
import { ALERTS_COLUMNS } from "../../constants";

const Component = ({ css, value }) => (
  <div className={css.photoIcon}>
    <Lightbox trigger={<ToggleIconCell value={Boolean(value)} icon={ALERTS_COLUMNS.photo} />} image={value} />
  </div>
);

Component.propTypes = {
  css: PropTypes.object,
  value: PropTypes.any
};

Component.displayName = "PhotoColumnBody";

export default Component;
