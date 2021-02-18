/* eslint-disable import/prefer-default-export */
export const ConditionalWrapper = ({ condition, wrapper: Wrapper, children, ...rest }) => {
  if (condition) {
    return typeof Wrapper === "function" ? Wrapper({ children, ...rest }) : <Wrapper {...rest}>{children}</Wrapper>;
  }

  return children;
};
