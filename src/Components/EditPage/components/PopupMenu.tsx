import React, { useContext, useState } from "react";
import { EditContext } from "../../models/editState";
import {
  Fade,
  CardContent,
  Popper,
  makeStyles,
  Theme,
  createStyles,
  TextField
} from "@material-ui/core";
import { Dropdown, Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { GameSelection } from "../../Survey/UserSelections/model/model";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: 10
    },
    popup: {
      zIndex: 400
    }
  })
);

export default function PopupMenu() {
  const editContext = useContext(EditContext);
  const classes = useStyles();
  const {
    selectedSelection,
    selectedSelectionPosition,
    game,
    closePopUp,
    update
  } = editContext;
  let presetValue: string;
  let presetToQuestion: number | undefined;

  if (selectedSelection && selectedSelection.object) {
    presetValue = selectedSelection.object.title;
    presetToQuestion =
      selectedSelection.object.to_question === null
        ? undefined
        : selectedSelection.object.to_question;
  }

  const [title, setTitle] = useState<string | undefined>();
  const [selected, setSelected] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Popper
      open={selectedSelectionPosition !== undefined}
      anchorEl={selectedSelectionPosition}
      transition
      placement="right"
      className={classes.popup}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          {selectedSelection &&
            selectedSelection.object &&
            game &&
            game.children && (
              <Card>
                <Card.Content>
                  <TextField
                    fullWidth
                    className={classes.title}
                    label="Title"
                    defaultValue={presetValue}
                    onChange={e => {
                      setTitle(e.target.value);
                    }}
                  ></TextField>

                  <Dropdown
                    defaultValue={presetToQuestion}
                    search
                    selection
                    fluid
                    placeholder="To Question"
                    onChange={(e, { value }) => {
                      setSelected(value as number);
                    }}
                    options={game.children.map(question => {
                      return {
                        key: question.object && question.object.title,
                        value: question.object && question.object.id,
                        text: question.object && question.object.title
                      };
                    })}
                  ></Dropdown>
                </Card.Content>
                <Card.Content>
                  <Button
                    fluid
                    onClick={async () => {
                      let confirm = window.confirm("Do you want to delete?");
                      if (confirm && game) {
                        await selectedSelection.delete();
                        game.children.forEach(async question => {
                          if (
                            question.object &&
                            question.object.id ===
                              (selectedSelection.object as GameSelection)
                                .for_question
                          ) {
                            await question.deleteChild(selectedSelection);
                            closePopUp();
                            closePopUp();
                            return;
                          }
                        });
                      }
                    }}
                  >
                    Remove
                  </Button>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    basic
                    loading={isLoading}
                    color="green"
                    onClick={async () => {
                      setIsLoading(true);
                      if (selectedSelection && selectedSelection.object) {
                        let newGameselection: GameSelection = {
                          ...selectedSelection.object,
                          title: title ? title : presetValue,
                          to_question: selected ? selected : presetToQuestion
                        };
                        selectedSelection.object = newGameselection;
                        await selectedSelection.update(newGameselection);
                        update(game);
                      }
                      setIsLoading(false);
                      closePopUp();
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    basic
                    color="red"
                    onClick={() => {
                      closePopUp();
                    }}
                  >
                    Close
                  </Button>
                </Card.Content>
              </Card>
            )}
        </Fade>
      )}
    </Popper>
  );
}
