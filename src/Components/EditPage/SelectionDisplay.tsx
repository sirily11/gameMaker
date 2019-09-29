import React, { useContext } from "react";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Popper,
  Fade,
  Paper,
  Typography
} from "@material-ui/core";
import { QuestionMaker } from "../Survey/UserSelections/editor/questions";
import classes from "*.module.css";
import { EditContext } from "../models/editState";

interface Props {
  question: QuestionMaker;
}

export default function SelectionDisplay(props: Props) {
  const { question } = props;
  const editContext = useContext(EditContext);

  return (
    <div>
      <RadioGroup>
        {question.children.map(s => (
          <FormControlLabel
            onClick={e => {
              console.log(e);
              editContext.select(e.currentTarget, s);
            }}
            key={s.id}
            value={s.object && s.object.title}
            control={<Radio />}
            label={s.object && s.object.title}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
