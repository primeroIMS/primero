// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import uuid from "../../libs/uuid";
import { queueIndexedDB } from "../../db";

export default async action => {
  await queueIndexedDB.add({ ...action, fromQueue: uuid.v4() });
};
