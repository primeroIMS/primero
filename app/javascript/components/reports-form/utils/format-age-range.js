import { AGE_MAX } from "../../../config";

export default data => data.map(elem => elem.replace(/\../g, " - ").replace(` - ${AGE_MAX}`, "+"));
