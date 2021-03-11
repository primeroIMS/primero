const tableCellGreaterThanZero = condition => ({
  setCellProps: currValue => {
    const value = parseInt(currValue, 10);
    const style = typeof value === "number" && value > 0 && condition ? { cursor: "pointer" } : { cursor: "auto" };

    return {
      style
    };
  }
});

export default tableCellGreaterThanZero;
