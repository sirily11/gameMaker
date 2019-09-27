import React, { Component } from "react";
import HomeIcon from "@material-ui/icons/Home";
import DashboardIcon from "@material-ui/icons/Dashboard";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Hidden
} from "@material-ui/core";
import { Link, NavLink } from "react-router-dom";

export default class DrawerNav extends Component {
  renderList() {
    return (
      <List style={{ width: "180px" }}>
        <NavLink to="/home">
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </NavLink>
        <NavLink to="/dashboard">
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="DashBoard" />
          </ListItem>
        </NavLink>
      </List>
    );
  }
  render() {
    return (
      <div>
          <Drawer open={this.props.isPermanent ? true : this.props.open} variant={this.props.isPermanent ? "permanent" : "temporary"} onClose={()=>{this.props.close()}}>
            <h5 className="mt-4 mb-3 mx-auto">{this.props.pageName}</h5>
            <Divider />
            {this.renderList()}
          </Drawer>
      </div>
    );
  }
}
