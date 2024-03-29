import React, { Component } from "react";
import { Schema, SchemaList, Widget } from "./model/Schema";
import { FieldAction } from "./model/Action";
import { FieldIcon } from "./model/Icon";
import { Form, Button, Container, Label } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import JSONSchemaTextField from "./Components/JSONSchemaTextField";
import JSONSchemaSelectField from "./Components/JSONSchemaSelectField";
import JSONSchemaForignField from "./Components/JSONSchemaForignField";

interface Props {
  schemas: Schema[] | any;
  values?: { [key: string]: any };
  actions?: FieldAction[];
  icons?: FieldIcon[];
  url: string;
  onSubmit?(data: { [key: string]: any }): Promise<void>;
}

interface State {
  schemaList?: SchemaList;
  submitSuccess?: boolean;
  loading: boolean;
}

export default class JSONSchema extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      schemaList: undefined,
      submitSuccess: undefined,
      loading: false
    };
  }

  componentDidMount() {
    const { schemas, values, icons, actions } = this.props;
    let schemaList: SchemaList = new SchemaList(schemas);

    if (values) {
      schemaList.merge(values);
    }
    if (icons) {
      let newSchema = FieldIcon.merge(schemaList.schemaList, icons);
      schemaList.schemaList = newSchema;
    }
    if (actions) {
      let newSchema = FieldAction.merge(schemaList.schemaList, actions);
      schemaList.schemaList = newSchema;
    }
    this.setState({ schemaList: schemaList });
  }

  /**
   * Onsave
   */
  onSaved = (value: string, schema: Schema) => {
    let v: any = value;
    if (schema.widget === Widget.number) {
      v = parseInt(value);
    }
    schema.value = v;
    this.setState({
      schemaList: this.state.schemaList
    });
  };

  /**
   * render field based on schema's type
   * @param schema Schema
   */
  renderField(schema: Schema) {
    switch (schema.widget) {
      case Widget.select:
        return (
          <JSONSchemaSelectField
            schema={schema}
            onSaved={v => this.onSaved(v, schema)}
          ></JSONSchemaSelectField>
        );
      case Widget.foreignkey:
        return (
          <JSONSchemaForignField
            select={choice => {
              schema.choice = choice;
              this.setState({
                schemaList: this.state.schemaList
              });
            }}
            schema={schema}
            onSaved={v => this.onSaved(v, schema)}
            url={this.props.url}
          ></JSONSchemaForignField>
        );
      case Widget.text:
        return (
          <JSONSchemaTextField
            schema={schema}
            onSaved={v => this.onSaved(v, schema)}
          />
        );
      case Widget.number:
        return (
          <JSONSchemaTextField
            schema={schema}
            onSaved={v => this.onSaved(v, schema)}
          />
        );
      default:
        return <div key={schema.name}></div>;
    }
  }

  render() {
    const { schemaList, submitSuccess, loading } = this.state;

    return (
      <Container>
        {submitSuccess !== undefined && (
          <Label basic color={submitSuccess ? "green" : "red"}>
            Submitted {submitSuccess ? "success" : "failed"}
          </Label>
        )}
        <Form loading={loading}>
          {schemaList &&
            schemaList.schemaList
              .filter(s => !s.readonly)
              .map(s => (
                <Form.Field key={s.name}>{this.renderField(s)}</Form.Field>
              ))}
          <Button
            loading={loading}
            onClick={async () => {
              this.setState({
                loading: true
              });
              if (schemaList && this.props.onSubmit) {
                try {
                  let data = schemaList.onSubmit();
                  await this.props.onSubmit(data);
                  this.setState({ submitSuccess: true });
                } catch (e) {
                  this.setState({ submitSuccess: false });
                } finally {
                  this.setState({ loading: false });
                }
              }
            }}
          >
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}
