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
  Tooltip,
  Fade
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import EditQuestionPopup from "./components/EditQuestionPopup";
import { Button, Label } from "semantic-ui-react";
import { QuestionMaker } from "../Survey/UserSelections/editor/questions";
import AddDialog from "./components/AddDialog";
import { Schema, Widget, Choice } from "./JSONSchema/model/Schema";
import { SelectionMaker } from "../Survey/UserSelections/editor/selection";
import {
  GameSelection,
  GameQuestion
} from "../Survey/UserSelections/model/model";

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
  //
  const [isLoading, setisLoading] = useState(false);
  const { game, update } = editContext;
  const classes = useStyles();

  /**
   * To Question choice
   */
  const choices =
    game &&
    game.children.map(q => {
      return {
        label: q.object && q.object.title,
        value: q.object && q.object.id
      } as Choice;
    });

  /**
   * Add question schema
   */
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

  /**
   * If this is the end of the game
   * @param question
   */
  const isEnd = (question: QuestionMaker): boolean => {
    if (!question.children || question.children.length === 0) return true;
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
          <Fade in={true}>
            <Card className={classes.card}>
              <CardContent>
                <Typography component="h5" variant="h5">
                  {c.object && c.object.title}
                  <Button
                    style={{ marginLeft: 10 }}
                    icon="edit"
                    size="mini"
                    circular
                    onClick={() => {
                      setOpen(true);
                      setEditIndex(index);
                    }}
                  ></Button>
                  <Button
                    style={{ marginLeft: 10 }}
                    icon="add"
                    size="mini"
                    circular
                    onClick={() => {
                      setEditIndex(index);
                      setOpenAddSelection(true);
                    }}
                  ></Button>
                  <Button
                    style={{ marginLeft: 10 }}
                    icon="trash"
                    loading={isLoading}
                    size="mini"
                    circular
                    onClick={async () => {
                      // Delete the current question
                      let confirmation = window.confirm(
                        "Do you want to delete?"
                      );
                      if (confirmation) {
                        setisLoading(true);
                        await c.delete();
                        if (game) {
                          await game.deleteChild(c);
                        }
                        setisLoading(false);
                        update(game);
                      }
                    }}
                  ></Button>
                </Typography>

                <Typography component="p">
                  {c.object && c.object.description}
                </Typography>
                {c.object && c.object.image && (
                  <CardMedia
                    className={classes.media}
                    image={c.object && c.object.image}
                  ></CardMedia>
                )}
                {c && <SelectionDisplay question={c}></SelectionDisplay>}
              </CardContent>
              {isEnd(c) ? (
                <Tooltip title="This is the end of the game">
                  <Label as="a" color="red" tag style={{ marginBottom: 10 }}>
                    End
                  </Label>
                </Tooltip>
              ) : null}
            </Card>
          </Fade>
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
            if (game) {
              let selection = new SelectionMaker({
                object: {
                  ...(data as GameSelection),
                  for_question: (game.children[editIndex]
                    .object as GameQuestion).id
                }
              });
              console.log(selection.object);
              await selection.create();
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
