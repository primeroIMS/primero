// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import { cx } from "@emotion/css";

import { useI18n } from "../../../../../i18n";
import { RECORD_PATH } from "../../../../../../config";
import css from "../../styles.css";
import DragIndicator from "../drag-indicator";
import LockedIcon from "../../../../../locked-icon";
import { useMemoizedSelector } from "../../../../../../libs";
import { selectModules } from "../../../../../application";

function Component({ name, modules, parentForm, uniqueID, id, index, editable, isDragDisabled = false }) {
  const primeroModules = useMemoizedSelector(state => selectModules(state));
  const i18n = useI18n();

  const nameStyles = cx({
    [css.formName]: true,
    [css.protected]: !editable
  });

  const formSectionModules = modules
    .map(module => primeroModules.find(primeroModule => primeroModule.unique_id === module)?.name)
    ?.join(", ");

  const renderIcon = !editable ? <LockedIcon /> : null;

  return (
    <Draggable draggableId={uniqueID} index={index} isDragDisabled={isDragDisabled}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} className={css.row}>
          <div>
            <DragIndicator {...provided.dragHandleProps} isDragDisabled={isDragDisabled} />
          </div>
          <div className={nameStyles}>
            {renderIcon}
            <Link to={`${RECORD_PATH.forms}/${id}/edit`}>{name}</Link>
          </div>
          <div>{i18n.t(`forms.record_types.${parentForm}`)}</div>
          <div>{formSectionModules}</div>
        </div>
      )}
    </Draggable>
  );
}

Component.displayName = "TableRow";

Component.propTypes = {
  editable: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  isDragDisabled: PropTypes.bool,
  modules: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  parentForm: PropTypes.string.isRequired,
  uniqueID: PropTypes.string.isRequired
};

export default Component;
