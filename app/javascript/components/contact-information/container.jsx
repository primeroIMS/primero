// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import useMemoizedSelector from "../../libs/use-memoized-selector";
import DisplayData from "../display-data";
import { useI18n } from "../i18n";

import { BLACK_LISTED_FIELDS } from "./constants";
import { selectSupportData } from "./selectors";
import css from "./styles.css";

function Support() {
  const supportData = useMemoizedSelector(state => selectSupportData(state));
  const i18n = useI18n();

  const renderInformation =
    supportData.toSeq().size > 0 &&
    supportData._keys.map(x => {
      if (BLACK_LISTED_FIELDS.includes(x)) {
        return null;
      }

      return (
        <DisplayData
          key={x}
          {...{
            label: `contact.field.${x}`,
            value: supportData[x]
          }}
        />
      );
    });

  return (
    <>
      <h1 className={css.PageTitle} data-testid="support">
        {i18n.t("contact.info_label")}
      </h1>
      {renderInformation}
    </>
  );
}

Support.displayName = "Support";

export default Support;
