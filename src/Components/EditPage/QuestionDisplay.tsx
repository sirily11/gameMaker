import React, { useContext } from "react";
import { EditContext } from "../models/editState";
import SelectionDisplay from "./SelectionDisplay";
import {
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
  Typography,
  CardMedia
} from "@material-ui/core";

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
  const { game } = editContext;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {game &&
        game.children.map(c => (
          <Card className={classes.card}>
            <CardContent>
              <Typography>{c.object && c.object.title}</Typography>
              <Typography component="p">
                {c.object && c.object.description}
              </Typography>
              <CardMedia
                className={classes.media}
                image="https://cdn.vox-cdn.com/thumbor/WlSQzgnWqpsktGQblwuHk8VCtJE=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/15961732/2019_03_14_at_9.01_AM.png"
              ></CardMedia>
              {c && <SelectionDisplay question={c}></SelectionDisplay>}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
