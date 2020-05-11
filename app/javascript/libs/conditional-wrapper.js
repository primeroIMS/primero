// eslint-disable-next-line import/prefer-default-export
export const ConditionalWrapper = ({ condition, wrapper, children, ...rest }) =>
  condition ? wrapper({ children, ...rest }) : children;
