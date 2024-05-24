// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import FormGroup from "../form-group";
import FormSection from "../form-section";

function Component({ formGroupsLookups, formSectionsByGroup, isReorderEnabled }) {
  return formSectionsByGroup.map((group, index) => {
    const formGroupID = group.first().get("form_group_id");

    const formGroupName = formGroupsLookups[formGroupID];

    return (
      <FormGroup
        name={formGroupName}
        index={index}
        key={formGroupID}
        id={formGroupID}
        isDragDisabled={!isReorderEnabled}
      >
        <FormSection group={group} collection={formGroupID} isDragDisabled={!isReorderEnabled} />
      </FormGroup>
    );
  });
}

Component.propTypes = {
  formGroupsLookups: PropTypes.object,
  formSectionsByGroup: PropTypes.object,
  isReorderEnabled: PropTypes.bool
};

export default Component;
