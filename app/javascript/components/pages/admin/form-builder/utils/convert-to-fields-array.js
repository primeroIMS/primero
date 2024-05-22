// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default fields => Object.keys(fields).map(key => ({ name: key, ...fields[key] }));
