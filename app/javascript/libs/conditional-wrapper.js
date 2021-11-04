/* eslint-disable import/prefer-default-export, import/exports-last */
export const ConditionalWrapper = ({ condition, wrapper: Wrapper, children, ...rest }) => {
  if (condition) {
    return typeof Wrapper === "function" ? Wrapper({ children, ...rest }) : <Wrapper {...rest}>{children}</Wrapper>;
  }

  return children;
};

ConditionalWrapper.displayName = "ConditionalWrapper";
