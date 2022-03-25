import isLogicalOperator from "./is-logical-operator";
import isComparisonOperator from "./is-comparison-operator";

export default value => isLogicalOperator(value) || isComparisonOperator(value);
