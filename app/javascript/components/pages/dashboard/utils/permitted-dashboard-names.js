import { PERMISSION_FOR_DASHBOARD_NAME } from "../constants";

export default ({ names, permittedAbilities }) =>
  names.filter(name => {
    const permission = PERMISSION_FOR_DASHBOARD_NAME[name] || name;

    return permittedAbilities.includes(permission);
  });
