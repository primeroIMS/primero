// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { List } from "immutable";

import NAMESPACE from "./namespace";

export const getMessages = state => state.getIn([NAMESPACE], List([]));
