import TablePercentageBar from "../table-percentage-bar";

function Component(value) {
  return <TablePercentageBar percentage={value} />;
}

Component.displayName = "PercentageCell";

export default Component;
