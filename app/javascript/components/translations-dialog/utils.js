// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { LOCALE_KEYS } from "../../config";

export const localesToRender = locales => locales.filter(locale => locale.id !== LOCALE_KEYS.en);

export const buildLocaleFields = locales =>
  locales.flatMap(locale => [`name.${locale.id}`, `description.${locale.id}`]);
