// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

export const selectDialog = state => state.getIn(["ui", "dialogs"], fromJS({}));

export const selectDialogPending = state => state.getIn(["ui", "dialogs", "pending"], false);

export const getAsyncLoading = (state, path) => state.getIn(path, false);
