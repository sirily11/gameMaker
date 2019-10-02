import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions
} from "@material-ui/core";
import { NavLink } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  navLink: string;
}

export default function ProjectCard(props: Props) {
  const { title, description, navLink } = props;

  return (
    <Card>
      <CardContent>
        <Typography component="h3">{title}</Typography>
        <Typography variant="body2" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <NavLink to={navLink}>
          <Button>Edit</Button>
        </NavLink>
        <Button>Delete</Button>
      </CardActions>
    </Card>
  );
}
