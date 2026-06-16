import isLogicalOperator from "./is-logical-operator";
import isComparisonOperator from "./is-comparison-operator";
import isMathematicalOperator from "./is-mathematical-operator";

export default value => isLogicalOperator(value) || isComparisonOperator(value) || isMathematicalOperator(value);
