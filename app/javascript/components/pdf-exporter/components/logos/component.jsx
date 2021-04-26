import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";

const Component = ({ shortId, logos, css }) => {
  const i18n = useI18n();

  if (!logos) return null;

  return (
    <div className={css.info}>
      <div>
        <div className={css.caseID}>{i18n.t("cases.show_case", { short_id: shortId })}</div>
        <div>{i18n.t("exports.printed", { date: i18n.localizeDate(new Date()) })}</div>
      </div>
      <div className={css.logos}>
        {logos.map(logo => (
          <img src={logo?.logoFull} alt={logo?.name} />
        ))}
      </div>
    </div>
  );
};

Component.defaultProps = {
  logos: []
};

Component.propTypes = {
  css: PropTypes.object,
  logos: PropTypes.array,
  shortId: PropTypes.string
};

Component.displayName = "Logos";

export default Component;
