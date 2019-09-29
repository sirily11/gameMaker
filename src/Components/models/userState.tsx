import React, { Component } from "react";
import { Game } from "../Survey/UserSelections/model/model";
import { Maker } from "../Survey/UserSelections/editor/maker";

interface User {
  userName: string;
}

interface UserState {
  user?: User;
  isLogin: boolean;
  signIn(username: string, password: string): void;
  signUp(username: string, password: string): void;
}

interface UserProps {}

export class UserProvider extends Component<UserProps, UserState> {
  constructor(props: UserProps) {
    super(props);
    this.state = {
      isLogin: false,
      signIn: this.signIn,
      signUp: this.signUp
    };
  }

  signIn = async (username: string, password: string) => {};

  signUp = async (username: string, password: string) => {};

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

const context: UserState = {
  isLogin: false,
  signIn: (username: string, password: string) => {},

  signUp: (username: string, password: string) => {}
};

export const UserContext = React.createContext(context);
