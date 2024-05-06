// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useI18n } from "../../../i18n";

function useSearchTitle({ phonetic }) {
  const i18n = useI18n();

  return phonetic ? i18n.t("navigation.phonetic_search.title") : i18n.t("navigation.id_search.title");
}

export default useSearchTitle;
