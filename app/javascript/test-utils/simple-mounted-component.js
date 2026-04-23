/* eslint-disable react/prop-types, react/display-name */
import { render } from "@testing-library/react";

function simpleMountedComponent(Component) {
  return render(Component);
}

export default simpleMountedComponent;
