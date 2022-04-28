import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import DB, { DB_STORES } from "../../db";
import { setQueueData } from "../connectivity/action-creators";

function useQueue() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      const queueData = await DB.getAll(DB_STORES.OFFLINE_REQUESTS);

      setData(queueData);
    };

    fetchQueue();
  }, []);

  useEffect(() => {
    dispatch(setQueueData(data));
  }, [data]);
}

export default useQueue;
