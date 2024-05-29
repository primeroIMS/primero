// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useRef } from "react";

const useResetCache = data => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);

  return ref;
};

export default useResetCache;
