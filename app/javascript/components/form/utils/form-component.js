import { isEqual } from "lodash";
import { memo } from "react";

export default Component => memo(Component, (prev, next) => isEqual(prev, next));
