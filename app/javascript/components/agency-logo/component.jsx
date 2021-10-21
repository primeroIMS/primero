import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";
import { memo } from "react";

import { getAgencyLogos } from "../application/selectors";
import { useMemoizedSelector } from "../../libs";

import css from "./styles.css";

const AgencyLogo = ({ alwaysFullLogo }) => {
  const agencyLogos = useMemoizedSelector(state => getAgencyLogos(state));
  const tabletDisplay = useMediaQuery(theme => theme.breakpoints.down("md"));

  const renderLogos = () => {
    return agencyLogos.map(agency => {
      const uniqueId = agency.get("unique_id");

      const logo = tabletDisplay && !alwaysFullLogo ? agency.get("logo_icon") : agency.get("logo_full");
      const style = { backgroundImage: `url(${logo})` };

      return <div id={`${uniqueId}-logo`} key={uniqueId} className={css.agencyLogo} style={style} />;
    });
  };

  return <div className={css.agencyLogoContainer}>{renderLogos()}</div>;
};

AgencyLogo.displayName = "AgencyLogo";

AgencyLogo.defaultProps = {
  alwaysFullLogo: false
};

AgencyLogo.propTypes = {
  alwaysFullLogo: PropTypes.bool
};

export default memo(AgencyLogo);
