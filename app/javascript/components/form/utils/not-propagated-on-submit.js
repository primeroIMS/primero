// Do not propagate form onSubmit
// Based on https://github.com/react-hook-form/react-hook-form/issues/1005#issuecomment-626050339
export default (handleSubmit, onSubmit) => async event => {
  event.preventDefault();
  event.stopPropagation();

  return handleSubmit(onSubmit)(event);
};
