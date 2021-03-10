const tableCellGreaterThanZero = condition => ({
  setCellProps: value => {
    const newValue = parseInt(value, 10);
    const style =
      typeof newValue === "number" && newValue > 0 && condition ? { cursor: "pointer" } : { cursor: "auto" };

    return {
      style
    };
  }
});

export default tableCellGreaterThanZero;
