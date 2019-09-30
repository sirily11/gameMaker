import React, { useState } from "react";
import { QuestionMaker } from "../Survey/UserSelections/editor/questions";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from "@material-ui/core";
import { Button } from "semantic-ui-react";

interface Props {
  question: QuestionMaker;
  open: boolean;
  close(): void;
}

export default function EditQuestionPopup(props: Props) {
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [imageURL, setImageURL] = useState<string>();
  const { open, question, close } = props;

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Edit {question.object && question.object.title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          defaultValue={question.object && question.object.title}
          onChange={e => setTitle(e.target.value)}
        ></TextField>
        <TextField
          fullWidth
          label="Description"
          multiline={true}
          rows={3}
          defaultValue={question.object && question.object.description}
          onChange={e => setDescription(e.target.value)}
        ></TextField>
        <TextField
          fullWidth
          label="Image"
          defaultValue={question.object && question.object.image}
          onChange={e => setImageURL(e.target.value)}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button>Close</Button>
        <Button color="green">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
