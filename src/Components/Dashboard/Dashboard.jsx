import React, { Component } from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  AppBar,
  Toolbar,
  Fade,
  LinearProgress,
  IconButton
} from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";
import DrawerNav from "../Home/DrawerNav";
import BardChartCard from "./BarChartCard";
import $ from "jquery";
import getURL from "../settings";
import MenuIcon from "@material-ui/icons/Menu";

const theme = createMuiTheme({
  palette: {
    primary: purple
  }
});

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      graphs: [],
      loading: true,
      width: window.innerWidth,
      open: false
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({ width: window.innerWidth });
    });
    this.setState({ loading: true });
    this.fetchAvgTimPerSurvey().then(() => {
      this.fetchTotalTimePerUser().then(() => {
        this.fetchCountPerSelection().then(() => {
          this.setState({ loading: false });
        });
      });
    });
  }

  fetchAvgTimPerSurvey() {
    return new Promise((resolve, reject) => {
      $.getJSON(getURL("get/avg/time/survey"), data => {
        let graphs = this.state.graphs;
        graphs.push({
          chartType: "bar",
          title: "Average Time Per Survey",
          size: "md",
          xKey: "title",
          yKey: "avg",
          datakey: "avg",
          data: data
        });
        this.setState({ graphs: graphs });
        return resolve();
      });
    });
  }

  fetchTotalTimePerUser() {
    return new Promise((resolve, reject) => {
      $.getJSON(getURL("get/total/time/user"), data => {
        let graphs = this.state.graphs;
        graphs.push({
          chartType: "bar",
          size: "md",
          title: "Total Time Per User",
          xKey: "uid",
          yKey: "total",
          datakey: "total",
          data: data
        });
        this.setState({ graphs: graphs });
        return resolve();
      });
    });
  }

  fetchCountPerSelection() {
    return new Promise((resolve, reject) => {
      $.getJSON(getURL("get/count/selection"), data => {
        let graphs = this.state.graphs;
        graphs.push({
          chartType: "bar",
          size: "md",
          title: "Count for each selection",
          xKey: "title",
          yKey: "count",
          datakey: "count",
          data: data
        });
        this.setState({ graphs: graphs });
        return resolve();
      });
    });
  }

  fetchAvgTimePerSelection() {}

  renderNavBar() {
    return (
      <AppBar position="static">
        <Toolbar>
          
          <IconButton
            style={{ color: "white" }}
            onClick={() => {
              let open = this.state.open;
              this.setState({ open: !open });
            }}
          >
            <MenuIcon />
          </IconButton>
          Survey
        </Toolbar>
      </AppBar>
    );
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <DrawerNav
          pageName={"Dashboard"}
          isPermanent={this.state.width >= 768}
          open={this.state.open}
          close={() => {
            this.setState({ open: false });
          }}
        />
        <div style={{ marginLeft: this.state.width >= 768 ? "180px" : "0px" }}>
          {this.renderNavBar()}
          <Fade in={this.state.loading} timeout={{ exit: 1000 }}>
            <LinearProgress />
          </Fade>
          <div className="container-fluid mt-3">
            <div className="row">
              {this.state.graphs.map((graph, index) => {
                if(graph.data.length === 0) return
                if (graph.chartType === "bar") {
                  return (
                    <BardChartCard
                      key={index}
                      title={graph.title}
                      size={graph.size}
                      data={graph.data}
                      xKey={graph.xKey}
                      yKey={graph.yKey}
                      dataKey={graph.datakey}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
