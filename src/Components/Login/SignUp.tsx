import React, { useContext } from "react";
import {
  CssBaseline,
  Grid,
  Typography,
  makeStyles,
  Paper
} from "@material-ui/core";
import { Schema, Widget } from "../EditPage/JSONSchema/model/Schema";
import { JSONSchema } from "../EditPage/JSONSchema";
import { NavLink } from "react-router-dom";
import { UserContext } from "../models/userState";
import { Message } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const signInSchema: Schema[] = [
  {
    name: "username",
    label: "User Name",
    readonly: false,
    required: true,
    widget: Widget.text
  },
  {
    name: "password",
    label: "Password",
    readonly: false,
    required: true,
    widget: Widget.text
  },
  {
    name: "password_confirm",
    label: "Password Confirm",
    readonly: false,
    required: true,
    widget: Widget.text
  }
];

export default function SignInSide() {
  const classes = useStyles();
  const userContext = useContext(UserContext);

  const { errMsgs } = userContext;
  const renderMsgs = () => {
    let list: any[] = [];
    for (let k in errMsgs["signUp"]) {
      list.push(
        <Message
          key={k}
          negative
          header={`${k}`}
          list={errMsgs.signUp[k]}
        ></Message>
      );
    }
    return list;
  };

  const signInPanel = (
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <JSONSchema
          schemas={signInSchema}
          url=""
          onSubmit={async data => {
            console.log("Sign Upo");
            await userContext.signUp(data);
          }}
        ></JSONSchema>
        <Grid container>
          <Grid item>
            <NavLink to="/">
              <div>"Have a account? Sign In"</div>
            </NavLink>
          </Grid>
          <Grid item xs={12}>
            {renderMsgs()}
          </Grid>
        </Grid>
      </div>
    </Grid>
  );

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />

      {signInPanel}
    </Grid>
  );
}
