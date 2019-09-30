import React, { useContext, useState } from "react";
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
  const { selectedSelection } = editContext;

  const isSelected = (id: number | undefined): boolean => {
    if (selectedSelection && selectedSelection.object && id) {
      if (selectedSelection.object.id === id) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <RadioGroup>
        {question.children.map(s => (
          <FormControlLabel
            onClick={e => {
              editContext.select(e.currentTarget, s);
            }}
            style={{
              backgroundColor: isSelected(s.object && s.object.id)
                ? "yellow"
                : undefined
            }}
            key={s.id}
            value={s.object && s.object.title}
            control={<Radio />}
            label={s.object && s.object.id}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
