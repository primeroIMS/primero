import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../libs";
import { getShowPoweredByPrimero } from "../application/selectors";
import ModuleLogo from "../module-logo";

import css from "./styles.css";

function Component({ isLogin = false }) {
  const showPoweredBy = useMemoizedSelector(state => getShowPoweredByPrimero(state));

  if (!showPoweredBy) {
    return false;
  }

  return (
    <div>
      <div className={isLogin ? css.poweredbyLogin : css.poweredby}>
        <div>Powered by</div>
        <div>
          <ModuleLogo moduleLogo="primero" useModuleLogo />
        </div>
      </div>
    </div>
  );
}

Component.displayName = "PoweredBy";

Component.propTypes = {
  isLogin: PropTypes.bool
};

export default Component;
