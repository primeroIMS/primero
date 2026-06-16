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
