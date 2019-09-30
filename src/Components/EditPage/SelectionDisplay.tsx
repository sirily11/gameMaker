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
import { Icon } from "semantic-ui-react";
import { SelectionMaker } from "../Survey/UserSelections/editor/selection";
import { GameQuestion } from "../Survey/UserSelections/model/model";

interface Props {
  question: QuestionMaker;
}

export default function SelectionDisplay(props: Props) {
  const { question } = props;
  const editContext = useContext(EditContext);
  const { selectedSelection, game } = editContext;

  /**
   * Selection is selected
   * @param id selected selection's id
   */
  const isSelected = (id: number | undefined): boolean => {
    if (selectedSelection && selectedSelection.object && id) {
      if (selectedSelection.object.id === id) {
        return true;
      }
    }
    return false;
  };

  /**
   * Get question' s title based on id
   * @param id to question
   */
  const getQuestion = (id: number): string => {
    if (game) {
      let q = game.children.find(q => q.object && q.object.id === id);
      if (q && q.object) {
        return q.object.title;
      }
    }
    return "";
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
            label={
              <Typography>
                {s.object && s.object.title} <Icon name="linkify"></Icon>
                {game &&
                  s.object &&
                  s.object.to_question &&
                  getQuestion(s.object.to_question)}
              </Typography>
            }
          />
        ))}
      </RadioGroup>
    </div>
  );
}
