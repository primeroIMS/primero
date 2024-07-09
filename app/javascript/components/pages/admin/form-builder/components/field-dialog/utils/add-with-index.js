// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];
