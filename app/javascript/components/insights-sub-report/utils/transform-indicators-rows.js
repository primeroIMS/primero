import { reduceMapToObject } from "../../../libs";
import transformOptions from "../../form/utils/transform-options";

export default (indicatorsRows, locale) =>
  indicatorsRows
    .entrySeq()
    .reduce((acc, [key, rows]) => ({ ...acc, [key]: transformOptions(reduceMapToObject(rows), locale) }), {});
