import React, { Component } from "react";
import { Game } from "../Survey/UserSelections/model/model";
import { Maker } from "../Survey/UserSelections/editor/maker";
import { SelectionMaker } from "../Survey/UserSelections/editor/selection";

interface EditState {
  game?: Maker;
  selectedSelectionPosition?: HTMLElement;
  selectedSelection?: SelectionMaker;
  build(data: Game): Promise<void>;
  closePopUp(): void;
  select(
    anchor: HTMLElement | undefined,
    selection: SelectionMaker | undefined
  ): void;
  update(data: Maker): void;
}

interface EditProps {}

const data = {
  id: 1,
  title: "Test Survey",
  create_at: "2019",
  questions: [
    {
      id: 1,
      title: "Test Question 1",
      description: "test question",
      image:
        "https://cdn.vox-cdn.com/thumbor/WlSQzgnWqpsktGQblwuHk8VCtJE=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/15961732/2019_03_14_at_9.01_AM.png",
      selections: [
        {
          id: 1,
          title: "To question 2",
          to_question: 2
        },
        {
          id: 2,
          title: "To question 3",
          to_question: 3
        }
      ]
    },
    {
      id: 2,
      title: "Test Question 2",
      description: "test question",
      image:
        "https://cdn.vox-cdn.com/thumbor/WlSQzgnWqpsktGQblwuHk8VCtJE=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/15961732/2019_03_14_at_9.01_AM.png",
      selections: [
        {
          id: 3,
          title: "To question 3",
          to_question: 3
        },
        {
          id: 4,
          title: "Finished"
        }
      ]
    },
    {
      id: 3,
      title: "Last question",
      description: "test question",
      selections: []
    }
  ]
};

export class EditProvider extends Component<EditProps, EditState> {
  constructor(props: EditProps) {
    super(props);
    this.state = {
      build: this.build,
      select: this.select,
      closePopUp: this.closePopUp,
      update: this.update
    };
  }

  async componentDidMount() {
    await this.build(data);
  }

  /**
   * when user select the choice
   */
  select = (
    anchor: HTMLElement | undefined,
    selection: SelectionMaker | undefined
  ) => {
    this.setState({
      selectedSelectionPosition: anchor,
      selectedSelection: selection
    });
  };

  /**
   * Update the game object
   */
  update = (data: Maker) => {
    this.setState({ game: data });
  };

  /**
   * Close user selection pannel
   */
  closePopUp = () => {
    this.setState({
      selectedSelectionPosition: undefined
    });
  };

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
  },
  select: (e: HTMLElement, s: SelectionMaker) => {},
  closePopUp: () => {},
  update: () => {}
};

export const EditContext = React.createContext(context);
