import { fromJS } from "immutable";

const DEFAULT_STATE = fromJS({ loading: false, data: [{ name: 'test', id: 1}], metadata: {} });

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    default:
      return state;
  }
};
