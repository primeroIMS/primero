import omit from "lodash/omit";

export default displayConditions => omit(displayConditions, ["disabled"]);
