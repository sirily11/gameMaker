import React from "react";
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
import { Container, Grid, MenuItem, Menu } from "@material-ui/core";
import ProjectCard from "./ProjectCard";
import { PopoverPosition } from "@material-ui/core/Popover";

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

const cards = [
  {
    title: "Abc",
    description: "Abcd",
    navLink: "abc"
  },
  {
    title: "Abcd",
    description: "Abcd",
    navLink: "abc"
  },
  {
    title: "Abce",
    description: "Abcd",
    navLink: "abc"
  },
  {
    title: "Abcf",
    description: "Abcd",
    navLink: "abc"
  },
  {
    title: "Abcg",
    description: "Abcd",
    navLink: "abc"
  }
];

export default function Home() {
  const classes = useStyles();


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
          News
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
          {cards.map((c, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <ProjectCard
                key={`${c.title}-${index}`}
                title={c.title}
                description={c.description}
                navLink={c.navLink}
              ></ProjectCard>
            </Grid>
          ))}
        </Grid>
      </div>
    </MuiThemeProvider>
  );
}
