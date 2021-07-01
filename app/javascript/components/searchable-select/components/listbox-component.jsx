import { Children, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { VariableSizeList } from "react-window";

import useResetCache from "../use-reset-cache";

import renderRow from "./render-row";
import OuterElementContext, { OuterElementType } from "./outer-element-type";

const LISTBOX_PADDING = 20;

const ListboxComponent = forwardRef(function ListboxComponent(props, ref) {
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

export const listboxClasses = makeStyles({
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0
    }
  }
});

export const virtualize = (optionsLength = 0) => {
  return optionsLength >= 20000 ? ListboxComponent : undefined;
};
