// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import clsx from "clsx";

import { useI18n } from "../../../../../i18n";
import FormSectionList from "../form-section-list";
import css from "../../styles.css";

function Component({ group, collection, isDragDisabled = false }) {
  const i18n = useI18n();

  const classes = clsx(css.row, css.header);

  return (
    <Droppable droppableId={`fs-${collection}`} type="formSection">
      {provided => (
        <div className={css.container} ref={provided.innerRef} {...provided.draggableProps}>
          <div className={classes}>
            <div />
            <div>{i18n.t("form_section.form_name")}</div>
            <div>{i18n.t("form_section.record_type")}</div>
            <div>{i18n.t("form_section.module")}</div>
          </div>
          <FormSectionList formSectionList={group.toList()} isDragDisabled={isDragDisabled} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

Component.displayName = "FormSection";

Component.propTypes = {
  collection: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired,
  isDragDisabled: PropTypes.bool
};

export default Component;
