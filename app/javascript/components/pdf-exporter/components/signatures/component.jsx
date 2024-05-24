// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";

import css from "./styles.css";
import { SIGNATURE_LABELS } from "./constants";

const Component = ({ types }) => {
  const i18n = useI18n();

  if (!types.length) return null;

  return (
    <div className={css.signatureContainer}>
      {Object.keys(SIGNATURE_LABELS)
        .filter(key => types.includes(key))
        .map(label => (
          <div className={css.signature} key={label}>
            <div className={css.signatureText}>
              <div>
                {SIGNATURE_LABELS[label].map(title => (
                  <div key={title}>{i18n.t(`exports.pdf_exports.${title}`)}</div>
                ))}
              </div>
              <div>{i18n.t("exports.pdf_exports.date")}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

Component.defaultProps = {
  types: []
};

Component.propTypes = {
  types: PropTypes.array
};

Component.displayName = "Signatures";

export default Component;
