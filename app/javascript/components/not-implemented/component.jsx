// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

function NotImplemented({ text }) {
  return (
    <div>
      <p>*** NOT IMPLEMENTED {text} ***</p>
    </div>
  );
}

NotImplemented.displayName = "NotImplemented";

NotImplemented.propTypes = {
  text: PropTypes.string
};

export default NotImplemented;
