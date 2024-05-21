// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/prop-types, react/display-name */
import { render } from "@testing-library/react";

function simpleMountedComponent(Component) {
  return render(Component);
}

export default simpleMountedComponent;
