export default (linkedIncidents, violenceLookupValues, options) =>
  linkedIncidents.reduce((prev, current) => {
    const violenceType = current.get("cp_incident_violence_type");
    const violenceTypeValue = violenceLookupValues.find(value => value.id === violenceType);

    return [
      ...prev,
      {
        id: current.get("unique_id"),
        display_text: `${current.get("short_id")} - ${options.localizeDate(current.get("incident_date"))}${
          violenceTypeValue ? ` - ${violenceTypeValue.display_text}` : ""
        }`,
        disabled: false
      }
    ];
  }, []);
