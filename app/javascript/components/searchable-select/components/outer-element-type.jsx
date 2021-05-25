import { createContext, forwardRef, useContext } from "react";

const OuterElementContext = createContext({});

const OuterElementType = forwardRef((props, ref) => {
  const outerProps = useContext(OuterElementContext);

  return <div ref={ref} {...props} {...outerProps} />;
});

export default OuterElementContext;

export { OuterElementType };
