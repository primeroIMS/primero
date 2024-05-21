// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

export const buildErrorMessages = data => data?.map(error => error.get("detail")).join(", ");
