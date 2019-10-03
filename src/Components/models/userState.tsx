import React, { Component } from "react";
import axios from "axios";
import { config } from "../Survey/UserSelections/config";

interface User {
  userName: string;
}

interface ErrorMsg {
  signIn?: { [key: string]: any };
  signUp?: { [key: string]: string[] };
}

interface UserState {
  user?: User;
  isLogin: boolean;
  errMsgs: ErrorMsg;
  signIn(args: any): Promise<void>;
  signUp(args: any): Promise<void>;
  signOut(): void;
}

interface UserProps {}

export class UserProvider extends Component<UserProps, UserState> {
  constructor(props: UserProps) {
    super(props);
    this.state = {
      isLogin: false,
      errMsgs: {},
      signIn: this.signIn,
      signUp: this.signUp,
      signOut: this.signOut
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("access")) {
      this.setState({ isLogin: true });
    }
  }

  /**
   * Sign In
   */
  signIn = async (args: any) => {
    let errMsgs = this.state.errMsgs;
    try {
      const { signInURL } = config;
      let response = await axios.post<{ refresh: string; access: string }>(
        signInURL,
        args
      );
      // store the token
      sessionStorage.setItem("access", response.data.access);
      this.setState({ errMsgs: {}, isLogin: true });
    } catch (err) {
      let msg: { [key: string]: string[] } = err.response.data;

      errMsgs.signIn = msg;
      this.setState({ errMsgs });
    }
  };

  /**
   * Sign Up
   */
  signUp = async (args: any) => {
    try {
      const { signUpURL } = config;
      let response = await axios.post<{ refresh: string; access: string }>(
        signUpURL,
        args
      );
      this.setState({ errMsgs: {} });
      await this.signIn({ username: args.username, password: args.password });
    } catch (err) {
      let msg: { [key: string]: string[] } = err.response.data;
      let errMsgs = this.state.errMsgs;
      errMsgs.signUp = msg;
      console.log(errMsgs);
      this.setState({ errMsgs });
    }
  };

  signOut = () => {
    sessionStorage.removeItem("access");
    this.setState({ isLogin: false });
  };

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
  signIn: () => {
    return Promise.resolve();
  },
  signUp: () => {
    return Promise.resolve();
  },
  signOut: () => {},
  errMsgs: {}
};

export const UserContext = React.createContext(context);
