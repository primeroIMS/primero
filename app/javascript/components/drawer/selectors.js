/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

export const getDrawers = state => state.getIn(["ui", "drawers"], fromJS({}));
