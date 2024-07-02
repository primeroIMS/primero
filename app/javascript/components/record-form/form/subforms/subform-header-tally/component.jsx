// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { displayNameHelper } from "../../../../../libs";

function Component({ value, displayName, locale }) {
  if (!value) {
    return null;
  }

  return (
    <>
      <span>
        {displayNameHelper(displayName, locale)} ({value.total})
      </span>
    </>
  );
}

Component.displayName = "SubformHeaderTally";

Component.propTypes = {
  displayName: PropTypes.object,
  locale: PropTypes.string,
  value: PropTypes.object
};

export default Component;
