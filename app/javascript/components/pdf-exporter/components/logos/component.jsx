// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import { RECORD_TYPES_PLURAL } from "../../../../config";
import { AssetJwt } from "../../../asset-jwt";

function Component({ shortId, recordType, logos = [], css }) {
  const i18n = useI18n();

  if (!logos) return null;

  return (
    <div className={css.info}>
      <div>
        <div className={css.caseID}>
          {i18n.t(`${RECORD_TYPES_PLURAL[recordType]}.show_${recordType}`, { short_id: shortId })}
        </div>
        <div>{i18n.t("exports.printed", { date: i18n.localizeDate(new Date()) })}</div>
      </div>
      <div className={css.logos}>
        {logos.map(logo => (
          <AssetJwt src={logo?.logoFull} alt={logo?.name} />
        ))}
      </div>
    </div>
  );
}

Component.propTypes = {
  css: PropTypes.object,
  logos: PropTypes.array,
  recordType: PropTypes.string,
  shortId: PropTypes.string
};

Component.displayName = "Logos";

export default Component;
