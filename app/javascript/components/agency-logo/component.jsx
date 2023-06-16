import PropTypes from "prop-types";
import { memo } from "react";
import clsx from "clsx";

import { getAgencyLogos } from "../application/selectors";
import { useMemoizedSelector } from "../../libs";

import css from "./styles.css";

function AgencyLogo({ alwaysFullLogo = false }) {
  const agencyLogos = useMemoizedSelector(state => getAgencyLogos(state));

  const renderLogos = () => {
    return agencyLogos.map(agency => {
      const uniqueId = agency.get("unique_id");
      const styleIcon = { backgroundImage: `url(${agency.get("logo_icon")})` };
      const styleFull = { backgroundImage: `url(${agency.get("logo_full")})` };
      const classesIcon = clsx([css.agencyLogo, css.agencyLogoIcon]);
      const classesFull = clsx(css.agencyLogo, { [css.agencyLogoFull]: !alwaysFullLogo });
      const fullLogo = <div id={`${uniqueId}-logo`} key={uniqueId} className={classesFull} style={styleFull} />;

      if (alwaysFullLogo) {
        return fullLogo;
      }

      return (
        <>
          <div
            id={`${uniqueId}-logo`}
            key={uniqueId}
            className={classesIcon}
            style={styleIcon}
            data-testid="background"
          />
          {fullLogo}
        </>
      );
    });
  };

  return <div className={css.agencyLogoContainer}>{renderLogos()}</div>;
}

AgencyLogo.displayName = "AgencyLogo";

AgencyLogo.propTypes = {
  alwaysFullLogo: PropTypes.bool
};

export default memo(AgencyLogo);
