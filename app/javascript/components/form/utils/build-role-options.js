export default roles =>
  roles.reduce(
    (prev, current) => [
      ...prev,
      { id: current.get("unique_id"), display_text: current.get("name"), disabled: current.get("disabled") }
    ],
    []
  );
