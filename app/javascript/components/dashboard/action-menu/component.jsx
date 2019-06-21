import React from "react";
import PropTypes from "prop-types";
import {
  createMuiTheme,
  MuiThemeProvider,
  useTheme
} from "@material-ui/core/styles";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const ITEM_HEIGHT = 48;

const ActionMenu = ({ open, onOpen, onClose, items }) => {
  const currentTheme = useTheme();

  const getMuiTheme = () => {
    return createMuiTheme({
      overrides: {
        MuiListItem: {
          button: {
            "&:hover": {
              backgroundColor: currentTheme.primero.colors.warmGrey1
            }
          }
        },
        MuiMenuItem: {
          root: {
            fontSize: "17px",
            fontFamily: currentTheme.typography.fontFamily,
            color: "#231e1f",
            lineHeight: 1,
            fontWeight: "normal"
          }
        }
      }
    });
  };

  const moreButtonRef = React.useRef(null);

  return (
    <MuiThemeProvider theme={{ ...currentTheme, ...getMuiTheme() }}>
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

ActionMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  items: PropTypes.object.isRequired
};

export default ActionMenu;
