// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../i18n";
import ListIcon from "../../list-icon";
import css from "../styles.css";

const EmptyState = ({ emptyMessage, type }) => {
  const i18n = useI18n();

  return (
    <div className={css.emptyContainer}>
      <div className={css.empty}>
        <ListIcon icon={type} className={css.emptyIcon} />
        <h5 className={css.emptyMessage}>{emptyMessage || i18n.t("errors.not_found")}</h5>
      </div>
    </div>
  );
};

EmptyState.displayName = "EmptyState";

EmptyState.propTypes = {
  emptyMessage: PropTypes.string,
  type: PropTypes.string
};

export default EmptyState;
