import React, { useState, useContext } from "react";
import { QuestionMaker } from "../../Survey/UserSelections/editor/questions";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from "@material-ui/core";
import { Button, Input, TextArea, Form, Label } from "semantic-ui-react";
import { GameQuestion } from "../../Survey/UserSelections/model/model";
import { EditContext } from "../../models/editState";

interface Props {
  question: QuestionMaker;
  open: boolean;
  close(): void;
}

export default function EditQuestionPopup(props: Props) {
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [image, setImageURL] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const editContext = useContext(EditContext);
  const { open, question, close } = props;
  const { game, update } = editContext;

  return (
    <Dialog open={open} onClose={close} fullWidth >
      <DialogTitle>Edit {question.object && question.object.title}</DialogTitle>
      <DialogContent>
        <Form>
          <Input
            fluid
            label="Title"
            defaultValue={question.object && question.object.title}
            onChange={e => setTitle(e.target.value)}
          ></Input>
          <TextArea
            style={{ marginTop: 10 }}
            fullWidth
            defaultValue={question.object && question.object.description}
            onChange={(e, { value }) => setDescription(value as string)}
          ></TextArea>
          <Input
            fluid
            style={{ marginTop: 10 }}
            label="Image"
            defaultValue={question.object && question.object.image}
            onChange={e => setImageURL(e.target.value)}
          ></Input>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Close</Button>
        <Button
          loading={isLoading}
          color="green"
          onClick={async () => {
            if (question.object && game) {
              setIsLoading(true);
              let object: GameQuestion = {
                ...question.object,
                title: title ? title : question.object.title,
                description: description
                  ? description
                  : question.object.description,
                image: image ? image : question.object.image
              };
              question.object = object;
              await question.update(object);
              update(game);
              close();
              setIsLoading(false);
            }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
