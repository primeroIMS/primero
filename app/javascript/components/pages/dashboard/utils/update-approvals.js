import { fromJS } from "immutable";

export default (approvals, payload) => {
  if (approvals && !approvals?.isEmpty()) {
    const approvalNames = payload.data.map(elem => elem.name);

    return approvals.filter(approval => !approvalNames.includes(approval.get("name"))).concat(fromJS(payload.data));
  }

  return fromJS(payload.data);
};
