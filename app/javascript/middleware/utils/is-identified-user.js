// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

export default store => store.getState().getIn(["user", "roleGroupPermission"]) === "identified";
