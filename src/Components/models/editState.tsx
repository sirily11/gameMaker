import React, { Component } from "react";
import { Game } from "../Survey/UserSelections/model/model";
import { Maker } from "../Survey/UserSelections/editor/maker";

interface EditState {
  game?: Maker;
  build(data: Game): Promise<void>;
}

interface EditProps {}

export class EditProvider extends Component<EditProps, EditState> {
  constructor(props: EditProps) {
    super(props);
    this.state = {
      build: this.build
    };
  }

  build = async (data: Game): Promise<void> => {
    let maker = new Maker({});
    await maker.build(data);
    this.setState({
      game: maker
    });
  };

  render() {
    return (
      <EditContext.Provider value={this.state}>
        {this.props.children}
      </EditContext.Provider>
    );
  }
}

const context: EditState = {
  build: (data: Game) => {
    return Promise.resolve();
  }
};

export const EditContext = React.createContext(context);
