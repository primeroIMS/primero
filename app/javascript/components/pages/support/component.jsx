import { useState } from "react";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import isEmpty from "lodash/isEmpty";

import PageContainer, { PageHeading } from "../../page";
import { useMemoizedSelector, useThemeHelper } from "../../../libs";
import { useI18n } from "../../i18n";
import { getCodeOfConductEnabled, getCodesOfConduct } from "../../application/selectors";

import { NAME } from "./constants";
import styles from "./styles.css";
import { menuList, renderSupportForm } from "./utils";
import { Navigation } from "./components";

const useStyles = makeStyles(styles);

const Component = () => {
  const css = useStyles();
  const i18n = useI18n();

  const codeOfConduct = useMemoizedSelector(state => getCodesOfConduct(state));
  const codeOfConductEnabled = useMemoizedSelector(state => getCodeOfConductEnabled(state));

  const disableCodeOfConduct = !codeOfConductEnabled || isEmpty(codeOfConduct);
  const renderMenuList = menuList(i18n, disableCodeOfConduct);

  const { mobileDisplay } = useThemeHelper();

  const [selectedItem, setSelectedItem] = useState(renderMenuList[0].id);
  const [toggleNav, setToggleNav] = useState(false);

  const Form = renderSupportForm(selectedItem);

  const handleToggleNav = () => setToggleNav(!toggleNav);
  const handleClick = id => {
    setSelectedItem(id);

    if (mobileDisplay) {
      handleToggleNav();
    }
  };

  // eslint-disable-next-line react/display-name, react/no-multi-comp
  const prefixAction = () =>
    mobileDisplay && (
      <IconButton aria-label="menu" size="small" onClick={handleToggleNav}>
        <MenuOpenIcon />
      </IconButton>
    );

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.support")} prefixAction={prefixAction} />
      <div className={css.mainSupport}>
        <Navigation
          css={css}
          onClick={handleClick}
          handleToggleNav={handleToggleNav}
          menuList={renderMenuList}
          mobileDisplay={mobileDisplay}
          selectedItem={selectedItem}
          toggleNav={toggleNav}
        />
        <div>
          <Form />
        </div>
      </div>
    </PageContainer>
  );
};

Component.displayName = NAME;

export default Component;
