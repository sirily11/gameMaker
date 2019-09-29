import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions
} from "@material-ui/core";

interface Props {
  title: string;
  description: string;
  navLink: string;
}

export default function ProjectCard(props: Props) {
  const { title, description, navLink } = props;
  const onClick = (e: any) => console.log();

  return (
    <Card>
      <CardContent>
        <Typography component="h3">{title}</Typography>
        <Typography variant="body2" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </CardActions>
    </Card>
  );
}
