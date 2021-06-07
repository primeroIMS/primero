import { AGE_MAX } from "../../../config";

export default data => data.join(", ").replace(/\../g, "-").replace(`-${AGE_MAX}`, "+");
