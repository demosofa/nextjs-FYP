import { Component } from "react";

class OverviewIndex extends Component {
  constructor() {
    this.state = {
      counter: 1,
    };
  }
  increment() {
    this.setState({
      counter: this.state.counter + 1,
    });
  }
  render() {
    return <div>{this.state.counter}</div>;
  }
}
