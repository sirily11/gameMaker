import React, { useContext, useState } from "react";
import { EditContext } from "../../models/editState";
import { Button, Icon } from "semantic-ui-react";
import {
  makeStyles,
  Theme,
  createStyles,
  Dialog,
  DialogTitle
} from "@material-ui/core";
import { Schema, Widget } from "../JSONSchema/model/Schema";
import AddDialog from "./AddDialog";
import { QuestionMaker } from "../../Survey/UserSelections/editor/questions";
import { GameQuestion } from "../../Survey/UserSelections/model/model";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    floatButton: {
      position: "fixed",
      bottom: 50,
      right: 50,
      zIndex: 300
    }
  })
);

const schemas: Schema[] = [
  {
    name: "title",
    label: "Question Title",
    readonly: false,
    required: true,
    widget: Widget.text
  },
  {
    name: "description",
    label: "Question Description",
    readonly: false,
    required: false,
    validations: { length: { maximum: 1000 } },
    widget: Widget.text
  },
  {
    name: "image",
    label: "Image URL",
    readonly: false,
    required: false,
    validations: { length: { maximum: 200 } },
    widget: Widget.text
  }
];

export default function FloatButton() {
  const classes = useStyles();
  const editContext = useContext(EditContext);
  const [showAdd, setShowEdit] = useState(false);
  const { game, update } = editContext;

  return (
    <div className={classes.floatButton}>
      <Button
        color="blue"
        onClick={() => {
          setShowEdit(true);
        }}
      >
        <Icon name="edit"></Icon>
        Edit
      </Button>
      {showAdd && (
        <AddDialog
          open={showAdd}
          schemas={schemas}
          title="Add Question"
          onClose={() => setShowEdit(false)}
          onSubmit={async data => {
            if (game) {
              let question = new QuestionMaker({
                object: {
                  ...(data as GameQuestion),
                  game: game.object && game.object.id
                }
              });
              console.log(question.object);
              await question.create();
              console.log(question.object);
              game.addChild(question);
              update(game);
              setShowEdit(false);
            }
          }}
        ></AddDialog>
      )}
    </div>
  );
}
