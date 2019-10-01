import React, { useContext, useState } from "react";
import { EditContext } from "../models/editState";
import { Dialog, DialogContent, DialogActions } from "@material-ui/core";
import {
  UserSelections,
  TreeData
} from "../Survey/UserSelections/player/UserSelections";
import Tree from "react-d3-tree";
import { Button } from "semantic-ui-react";

const containerStyles = {
  height: "100vh",
  overflowX: "hidden"
};

interface Props {
  data: TreeData;
}

class CenteredTree extends React.PureComponent<Props> {
  state: { translate?: any } = {};
  treeContainer: any;

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width * 0.5,
        y: dimensions.height * 0.05
      }
    });
  }

  render() {
    return (
      <div
        style={{ overflowX: "hidden", height: "100%" }}
        ref={tc => (this.treeContainer = tc)}
      >
        <Tree
          data={this.props.data}
          translate={this.state.translate}
          orientation={"vertical"}
        />
      </div>
    );
  }
}

interface TreeProps {
  open: boolean;
  onClose(): void;
}

export default function TreeView(props: TreeProps) {
  const editContext = useContext(EditContext);

  const { game } = editContext;
  let json = game && game.toJSON();
  let [treeData, setTree] = useState<TreeData>();
  let userSelections = new UserSelections();
  if (json && !treeData) {
    userSelections
      .build(json)
      .then(async us => {
        console.log(us);
        let data = await us.toTreeData();
        setTree(data);
      })
      .catch(e => console.log(e));
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth>
      <DialogContent style={{ height: "100vh" }}>
        {treeData && <CenteredTree data={treeData}></CenteredTree>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
