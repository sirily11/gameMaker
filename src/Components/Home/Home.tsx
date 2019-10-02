import React, { useContext, useState } from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { purple, lightBlue } from "@material-ui/core/colors";
import { Grid } from "@material-ui/core";
import ProjectCard from "./ProjectCard";
import { EditContext } from "../models/editState";
import axios from "axios";
import { config } from "../Survey/UserSelections/config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    display: {
      padding: 10
    }
  })
);

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: lightBlue
  }
});

interface Projects {
  id: number;
  title: string;
}

export default function Home() {
  const classes = useStyles();
  const editContext = useContext(EditContext);

  const [projects, setprojects] = useState<Projects[]>();

  if (!projects) {
    const { baseURL } = config;
    axios.get<Projects[]>(`${baseURL}/game/`).then(res => {
      setprojects(res.data);
    });
  }

  const appbar = () => (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Home
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        {appbar()}
        <Grid container spacing={1} className={classes.display}>
          {projects &&
            projects.map((c, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <ProjectCard
                  key={`${c.title}-${index}`}
                  title={c.title}
                  description={""}
                  navLink={`edit/${c.id as number}`}
                ></ProjectCard>
              </Grid>
            ))}
        </Grid>
      </div>
    </MuiThemeProvider>
  );
}
