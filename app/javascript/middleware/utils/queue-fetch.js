import uuid from "../../libs/uuid";
import { queueIndexedDB } from "../../db";

export default async action => {
  await queueIndexedDB.add({ ...action, fromQueue: uuid.v4() });
};
