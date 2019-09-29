import React, { useContext } from "react";
import { EditContext } from "../models/editState";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: 10
    },
    popup: {
      zIndex: 200
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
    closePopUp
  } = editContext;
  return (
    <Popper
      open={selectedSelectionPosition !== undefined}
      anchorEl={selectedSelectionPosition}
      transition
      placement="right-start"
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
                    value={selectedSelection.object.title}
                  ></TextField>
                  <Dropdown
                    search
                    selection
                    fluid
                    placeholder="To Question"
                    options={game.children.map(question => {
                      return {
                        key: question.object && question.object.title,
                        value: question.object && question.object.id,
                        text: question.object && question.object.title
                      };
                    })}
                  ></Dropdown>
                </Card.Content>
                <Card.Content extra>
                  <Button basic color="green">
                    Approve
                  </Button>
                  <Button
                    basic
                    color="red"
                    onClick={() => {
                      closePopUp();
                    }}
                  >
                    Decline
                  </Button>
                </Card.Content>
              </Card>
            )}
        </Fade>
      )}
    </Popper>
  );
}
