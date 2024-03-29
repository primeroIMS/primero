// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createContext, forwardRef, useContext } from "react";

const OuterElementContext = createContext({});

const OuterElementType = forwardRef((props, ref) => {
  const outerProps = useContext(OuterElementContext);

  return <div ref={ref} {...props} {...outerProps} />;
});

OuterElementType.displayName = "OuterElementType";

export default OuterElementContext;

export { OuterElementType };
