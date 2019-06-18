import React from "react";
import {
  createMuiTheme,
  MuiThemeProvider,
  useTheme
} from "@material-ui/core/styles";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const ITEM_HEIGHT = 48;

const ActionMenu = ({ open, onOpen, onClose, items }) => {

  const theme = useTheme();

  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiListItem: {
          button: {
            "&:hover": {
              backgroundColor: theme.primero.colors.warmGrey1
            }
          }
        }
      }
    });

  const moreButtonRef = React.useRef(null);
  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <IconButton
        aria-label="More"
        aria-controls="long-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={onOpen}
        ref={moreButtonRef}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={moreButtonRef.current}
        open={open}
        onClose={onClose}
        keepMounted
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        {items.map(item => {
          return (
            <MenuItem key={item.get("id")} onClick={item.get("onClick")}>
              {item.get("label")}
            </MenuItem>
          );
        })}
      </Menu>
    </MuiThemeProvider>
  );
};

export default ActionMenu;
