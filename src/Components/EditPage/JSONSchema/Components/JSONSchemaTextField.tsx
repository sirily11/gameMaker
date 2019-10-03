import React from "react";
import { Schema, Widget } from "../model/Schema";
import { Input, Form, Label } from "semantic-ui-react";

export interface FieldProps {
  schema: Schema;
  onSaved(value: any): void;
}

export default function JSONSchemaTextField(props: FieldProps) {
  const { schema, onSaved } = props;

  function hasError() {
    if (schema.required && schema.value === undefined) {
      return { content: "This field is required", pointing: "below" };
    }

    return;
  }

  if (
    schema.validations &&
    schema.validations.length &&
    schema.validations.length.maximum &&
    schema.validations.length.maximum > 300
  ) {
    return (
      <div>
        <Form.TextArea
          data-testid="input-field"
          label={schema.label}
          error={hasError()}
          onChange={(e, { value }) => {
            onSaved(value);
          }}
          defaultValue={schema.value}
        ></Form.TextArea>
        {schema.extra && schema.extra.help && (
          <Label color="blue">{schema.extra.help}</Label>
        )}
      </div>
    );
  }

  return (
    <div>
      <Form.Input
        data-testid="input-field"
        type={schema.name.includes("password") ? "password" : undefined}
        control={Input}
        label={schema.label}
        error={hasError()}
        onChange={(e, { value }) => {
          onSaved(value);
        }}
        defaultValue={schema.value}
      ></Form.Input>
      {schema.extra && schema.extra.help && (
        <Label color="blue">{schema.extra.help}</Label>
      )}
    </div>
  );
}
