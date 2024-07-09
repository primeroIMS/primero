// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";

import useMemoizedSelector from "../../libs/use-memoized-selector";

import { setDrawer, toggleDrawer } from "./action-creators";
import { getDrawers } from "./selectors";

export const useDrawer = drawer => {
  const dispatch = useDispatch();

  const drawers = useMemoizedSelector(state => getDrawers(state));

  const handleToggle = () => {
    dispatch(toggleDrawer(drawer));
  };

  const handleDrawer = open => {
    dispatch(setDrawer({ name: drawer, open }));
  };

  return { drawer, drawerOpen: drawers.get(drawer, false), toggleDrawer: handleToggle, setDrawer: handleDrawer };
};

export default useDrawer;
