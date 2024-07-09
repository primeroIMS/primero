// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../../../../i18n";
import { displayNameHelper } from "../../../../../../libs";
import TableRow from "../table-row";

function Component({ formSectionList, isDragDisabled }) {
  const i18n = useI18n();

  return formSectionList
    .sortBy(form => form.order)
    .map((formSection, index) => {
      const { name, module_ids: modules, parent_form: parentForm, unique_id: uniqueID, editable, id } = formSection;

      return (
        <TableRow
          name={displayNameHelper(name, i18n.locale)}
          modules={modules}
          parentForm={parentForm}
          index={index}
          uniqueID={uniqueID}
          key={uniqueID}
          editable={editable}
          id={id}
          isDragDisabled={isDragDisabled}
        />
      );
    });
}

Component.propTypes = {
  formSectionList: PropTypes.array,
  isDragDisabled: PropTypes.bool
};

export default Component;
