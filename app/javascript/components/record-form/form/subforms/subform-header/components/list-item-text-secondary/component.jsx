import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../../../../i18n";

import { NAME } from "./constants";
import css from "./styles.css";
import { buildAssociatedViolationsKeys } from "./utils";

const Component = ({ associatedViolations, violationsIDs }) => {
  const i18n = useI18n();

  if (isEmpty(associatedViolations) || isEmpty(violationsIDs)) return null;

  const violationsKeys = buildAssociatedViolationsKeys(associatedViolations, violationsIDs);

  return (
    <div id="list-item-text-secondary-violations">
      <h4 className={css.title}>{i18n.t("incident.violation.associated_violations")}</h4>
      {violationsKeys.map(violationKey => {
        return (
          <div className={css.item}>
            <div id={`id-div-list-item-seconday-${violationKey}`} key={`key-list-item-seconday-${violationKey}`}>
              {i18n.t(`incident.violation.types.${violationKey}`)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Component.propTypes = {
  associatedViolations: PropTypes.object,
  violationsIDs: PropTypes.array
};

Component.displayName = NAME;

export default Component;
