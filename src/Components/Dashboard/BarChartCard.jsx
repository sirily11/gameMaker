import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

export default class BardChartCard extends Component {
  constructor() {
    super();
    this.visitedName = [];
    this.colorIndex = 0;
    this.color = [
      "#42a5f5",
      "#43a047",
      "#ff9800",
      "#2196f3",
      "#00bcd4",
      "#81d4fa",
      "#00acc1",
      "#03a9f4",
      "#ce93d8",
      "#673ab7"
    ];
  }
  render() {
    let size = "";
    if (this.props.size === "sm") {
      size = "col-4 col-md-3 col-lg-2";
    } else {
      size = "col-12 col-md-6 col-lg-4";
    }
    return (
      <div className={`mt-2 ${size}`}>
       <div className="d-flex"><h4 className="mx-auto">{this.props.title}</h4></div> 
        <Paper>
          <ResponsiveContainer height="100%" width="100%" minHeight={400}>
            <BarChart data={this.props.data}>
              <XAxis dataKey={this.props.xKey} />
              <YAxis dataKey={this.props.yKey} />
              <Tooltip></Tooltip>
              <CartesianGrid />
              <Bar dataKey={this.props.dataKey} fill="#8884d8">
                {this.props.data.map((d, i) => {
                  let c = "";
                  if (!this.visitedName.includes(d[this.props.xKey])) {
                    this.visitedName.push(d[this.props.xKey]);
                    c = this.color[this.visitedName.length - 1% this.color.length];
                  } else {
                    let index = this.visitedName.indexOf(d[this.props.xKey]);
                    c = this.color[index % this.color.length];
                  }
                  return <Cell fill={c} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </div>
    );
  }
}
