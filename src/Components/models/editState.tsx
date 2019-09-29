import React, { Component } from "react";
import { Game } from "../Survey/UserSelections/model/model";


interface EditState {
    game?: Game
 
}

interface EditProps {}


export class DisplayProvider extends Component<EditProps, EditState> {
  constructor(props: EditProps) {
    super(props);
    this.state = {
    
    };
  }

  render() {
    return (
      <EditContext.Provider value={this.state}>
        {this.props.children}
      </EditContext.Provider>
    );
  }
}

const context: EditState = {
 
};

export const EditContext = React.createContext(context);