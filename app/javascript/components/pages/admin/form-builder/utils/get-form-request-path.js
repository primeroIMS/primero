// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH, SAVE_METHODS } from "../../../../../config";

export default (id, saveMethod) =>
  saveMethod === SAVE_METHODS.update ? `${RECORD_PATH.forms}/${id}` : RECORD_PATH.forms;
