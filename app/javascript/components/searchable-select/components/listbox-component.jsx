// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Children, forwardRef } from "react";
import { VariableSizeList } from "react-window";
import PropTypes from "prop-types";

import useResetCache from "../use-reset-cache";

import css from "./styles.css";
import renderRow from "./render-row";
import OuterElementContext, { OuterElementType } from "./outer-element-type";

const LISTBOX_PADDING = 20;

const ListboxComponent = forwardRef((props, ref) => {
  const { children, ...other } = props;
  const itemData = Children.toArray(children);
  const itemCount = itemData.length;
  const itemSize = 58;

  const getChildSize = () => {
    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }

    return itemData.map(getChildSize).reduce((prev, curr) => prev + curr, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={index => getChildSize(itemData[index])}
          overscanCount={1}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.displayName = "ListboxComponent";

ListboxComponent.propTypes = {
  children: PropTypes.node
};

export const listboxClasses = css.listbox;

export const virtualize = (optionsLength = 0) => {
  return optionsLength >= 20000 ? ListboxComponent : undefined;
};
