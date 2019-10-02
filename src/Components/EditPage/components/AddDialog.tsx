import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import JSONSchema from "../JSONSchema/JSONSchema";
import { Schema } from "../JSONSchema/model/Schema";
import { Modal } from "semantic-ui-react";

interface Props {
  open: boolean;
  title: string;
  onClose?(): void;
  onSubmit?(data: { [key: string]: any }): void;
  schemas: Schema[];
}

export default function AddDialog(props: Props) {
  const { open, onClose, onSubmit, schemas, title } = props;
  return (
    <Modal open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <Modal.Content>
        <JSONSchema schemas={schemas} onSubmit={onSubmit} url=""></JSONSchema>
      </Modal.Content>
    </Modal>
  );
}
