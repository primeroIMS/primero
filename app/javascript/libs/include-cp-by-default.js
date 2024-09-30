import { MODULES } from "../config";

function includeCPByDefault(primeroModule) {
  if (Array.isArray(primeroModule)) {
    return !(primeroModule.length === 1 && [MODULES.GBV, MODULES.MRM].includes(primeroModule[0]));
  }

  return ![MODULES.GBV, MODULES.MRM].includes(primeroModule);
}

export default includeCPByDefault;
