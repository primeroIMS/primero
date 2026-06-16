export default fields => Object.keys(fields).map(key => ({ name: key, ...fields[key] }));
