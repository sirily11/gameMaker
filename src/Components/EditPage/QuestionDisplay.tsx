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
  Collapse
} from "@material-ui/core";
import { GameQuestion } from "../Survey/UserSelections/model/model";
import EditQuestionPopup from "./EditQuestionPopup";
import { Button } from "semantic-ui-react";

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
        marginRight: 300,
        marginLeft: 300
      },
      [theme.breakpoints.up("lg")]: {
        marginRight: 400,
        marginLeft: 400
      },

      marginRight: 100,
      marginLeft: 100
    },
    media: {
      height: 40,
      marginRight: 40,
      marginLeft: 40,
      paddingTop: "56.25%" // 16:9
    }
  })
);

export default function QuestionDisplay() {
  const editContext = useContext(EditContext);
  const [open, setOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [imageURL, setImageURL] = useState<string>();

  const { game } = editContext;
  const classes = useStyles();

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
              </Typography>

              <Typography component="p">
                {c.object && c.object.description}
              </Typography>
              <Collapse in={c.object && c.object.image !== undefined}>
                <CardMedia
                  className={classes.media}
                  image={c.object && c.object.image}
                ></CardMedia>
              </Collapse>
              {c && <SelectionDisplay question={c}></SelectionDisplay>}
            </CardContent>
          </Card>
        ))}
      {game && editIndex >= 0 && (
        <EditQuestionPopup
          open={open}
          close={() => setOpen(false)}
          question={game.children[editIndex]}
        ></EditQuestionPopup>
      )}
    </div>
  );
}
