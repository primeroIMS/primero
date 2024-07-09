// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (optionLabels, value, locale = "en") => optionLabels[locale].find(option => option.id === value);
