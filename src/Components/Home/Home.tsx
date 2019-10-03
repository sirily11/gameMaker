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
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress
} from "@material-ui/core";
import ProjectCard from "./ProjectCard";
import axios from "axios";
import { config } from "../Survey/UserSelections/config";
import AddIcon from "@material-ui/icons/Add";
import { Schema, Widget } from "../EditPage/JSONSchema/model/Schema";
import { JSONSchema } from "../EditPage/JSONSchema";
import { UserContext } from "../models/userState";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

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

const schemas: Schema[] = [
  {
    name: "title",
    label: "Project name",
    readonly: false,
    required: true,
    widget: Widget.text
  }
];

interface Projects {
  id: number;
  title: string;
}

export default function Home() {
  const classes = useStyles();
  const userContext = useContext(UserContext);

  const [projects, setprojects] = useState<Projects[]>();
  const [show, setShow] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  if (!projects) {
    const { baseURL } = config;
    let token = sessionStorage.getItem("access");
    axios
      .get<Projects[]>(`${baseURL}/game/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setprojects(res.data);
      });
  }

  const deleteIndex = async (index: number, id: number) => {
    console.log(index);
    try {
      setisLoading(true);
      const { baseURL } = config;
      let res = await axios.delete<Projects>(`${baseURL}/game/${id}/`);
      if (projects) {
        let deleted = projects.splice(index, 1);
      }
    } catch (err) {
      alert(err);
    } finally {
      setTimeout(() => {
        setisLoading(false);
        setprojects(projects);
      }, 200);
    }
  };

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
        <IconButton color="inherit" onClick={() => setShow(true)}>
          <AddIcon></AddIcon>
        </IconButton>

        <IconButton color="inherit" onClick={() => userContext.signOut()}>
          <ExitToAppIcon></ExitToAppIcon>
        </IconButton>
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
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                lg={2}
                key={`${c.title}-${index}`}
              >
                <ProjectCard
                  title={c.title}
                  description={""}
                  onDelete={async () => {
                    deleteIndex(index, c.id);
                  }}
                  navLink={`edit/${c.id as number}`}
                ></ProjectCard>
              </Grid>
            ))}
        </Grid>
      </div>
      <Dialog open={isLoading} fullWidth>
        <DialogContent>
          <LinearProgress></LinearProgress>
        </DialogContent>
      </Dialog>
      {show && (
        <Dialog
          open={show}
          onClose={() => {
            setShow(false);
          }}
        >
          <DialogTitle>Add new project</DialogTitle>
          <DialogContent>
            <JSONSchema
              url=""
              schemas={schemas}
              onSubmit={async data => {
                const { baseURL, token } = config;
                let res = await axios.post<Projects>(`${baseURL}/game/`, data, {
                  headers: { Authorization: `Bearer ${token()}` }
                });
                if (projects) {
                  projects.push(res.data);
                  setprojects(projects);
                } else {
                  setprojects([res.data]);
                }
                setShow(false);
              }}
            ></JSONSchema>
          </DialogContent>
        </Dialog>
      )}
    </MuiThemeProvider>
  );
}
