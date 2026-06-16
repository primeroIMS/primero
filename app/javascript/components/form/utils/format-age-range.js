import { AGE_MAX } from "../../../config";

export default range => range.replace(/\../g, " - ").replace(` - ${AGE_MAX}`, "+");
