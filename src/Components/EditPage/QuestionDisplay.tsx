import React, { useContext, useState } from "react";
import { EditContext } from "../models/editState";
import SelectionDisplay from "./SelectionDisplay";
import {
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Collapse,
  Tooltip
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import EditQuestionPopup from "./components/EditQuestionPopup";
import { Button } from "semantic-ui-react";
import { QuestionMaker } from "../Survey/UserSelections/editor/questions";
import AddDialog from "./components/AddDialog";
import { Schema, Widget, Choice } from "./JSONSchema/model/Schema";
import { SelectionMaker } from "../Survey/UserSelections/editor/selection";
import { GameSelection } from "../Survey/UserSelections/model/model";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      top: 100,
      marginBottom: 20,
      width: "100%",
      zIndex: 130
    },
    card: {
      marginTop: 20,
      [theme.breakpoints.up("md")]: {
        marginRight: 280,
        marginLeft: 280
      },
      [theme.breakpoints.up("lg")]: {
        marginRight: 340,
        marginLeft: 340
      },

      marginRight: 100,
      marginLeft: 100
    },
    media: {
      height: 40,
      marginRight: 40,
      marginLeft: 40,
      paddingTop: "56.25%" // 16:9
    },
    floadIcon: {
      height: 30,
      width: 30,
      margin: "10px 10px",
      color: "green"
    }
  })
);

export default function QuestionDisplay() {
  const editContext = useContext(EditContext);
  // Open Edit Question Dialog state
  const [open, setOpen] = useState<boolean>(false);
  // Current edit index
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [openAddSelection, setOpenAddSelection] = useState(false);

  const { game, update } = editContext;
  const classes = useStyles();

  const choices =
    game &&
    game.children.map(q => {
      return {
        label: q.object && q.object.title,
        value: q.object && q.object.id
      } as Choice;
    });

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
      name: "to_question",
      label: "To Question",
      readonly: false,
      required: false,
      extra: {
        choices: choices
      },
      validations: { length: { maximum: 1000 } },
      widget: Widget.select
    }
  ];

  const isEnd = (question: QuestionMaker): boolean => {
    for (let selection of question.children) {
      if (selection.object && !selection.object.to_question) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={classes.root}>
      {game &&
        game.children.map((c, index) => (
          <Card className={classes.card}>
            <CardContent>
              <Typography component="h5" variant="h5">
                {c.object && c.object.title}
                <Button
                  style={{ marginLeft: 10 }}
                  icon="edit"
                  onClick={() => {
                    setOpen(true);
                    setEditIndex(index);
                  }}
                ></Button>
                <Button
                  style={{ marginLeft: 10 }}
                  icon="add"
                  onClick={() => {
                    setEditIndex(index);
                    setOpenAddSelection(true);
                  }}
                ></Button>
              </Typography>

              <Typography component="p">
                {c.object && c.object.description}
              </Typography>
              <Collapse
                in={c.object && c.object.image !== undefined}
                mountOnEnter
                unmountOnExit
              >
                <CardMedia
                  className={classes.media}
                  image={c.object && c.object.image}
                ></CardMedia>
              </Collapse>
              {c && <SelectionDisplay question={c}></SelectionDisplay>}
            </CardContent>
            {isEnd(c) ? (
              <Tooltip title="This is the end of the game">
                <ExitToAppIcon className={classes.floadIcon}></ExitToAppIcon>
              </Tooltip>
            ) : null}
          </Card>
        ))}
      {game && editIndex >= 0 && (
        <EditQuestionPopup
          open={open}
          close={() => setOpen(false)}
          question={game.children[editIndex]}
        ></EditQuestionPopup>
      )}
      {openAddSelection && (
        <AddDialog
          title="Add Selection"
          open={openAddSelection}
          onClose={() => setOpenAddSelection(false)}
          schemas={schemas}
          onSubmit={async data => {
            console.log(data);
            let selection = new SelectionMaker({
              object: data as GameSelection
            });
            if (game) {
              await game.children[editIndex].addChild(selection);
              setOpenAddSelection(false);
              update(game);
            }
          }}
        ></AddDialog>
      )}
    </div>
  );
}
