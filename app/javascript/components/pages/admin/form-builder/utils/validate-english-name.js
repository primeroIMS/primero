import { invalidCharRegexp } from "../../../../../libs";

export default async value => !(value.match(invalidCharRegexp)?.length || value.match(/^(\s+)$/)?.length);
