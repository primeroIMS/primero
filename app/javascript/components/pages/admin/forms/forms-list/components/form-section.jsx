import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import clsx from "clsx";

import { useI18n } from "../../../../../i18n";
import styles from "../styles.css";

import TableRow from "./table-row";

const FormSection = ({ group, collection }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <Droppable droppableId={`fs-${collection}`} type="formSection">
      {provided => (
        <div
          className={css.container}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className={clsx(css.row, css.header)}>
            <div />
            <div>{i18n.t("form_section.form_name")}</div>
            <div>{i18n.t("form_section.record_type")}</div>
            <div>{i18n.t("form_section.module")}</div>
          </div>
          {group.toList().map((formSection, index) => {
            const {
              name,
              module_ids: modules,
              parent_form: parentForm,
              unique_id: uniqueID
            } = formSection;

            return (
              <TableRow
                name={i18n.getI18nStringFromObject(name)}
                modules={modules}
                parentForm={parentForm}
                index={index}
                uniqueID={uniqueID}
                key={uniqueID}
              />
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

FormSection.displayName = "FormSection";

FormSection.propTypes = {
  collection: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired
};

export default FormSection;
