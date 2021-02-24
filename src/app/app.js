import ValidatorWorker from "worker-loader!./validator/validator_worker.js";

import React, { Component } from "react";
import { render } from "react-dom";
import store from "./store/index";
import { Provider } from "react-redux";
import Layout from "./components/_layout";
import Index from "./components/editor";

import "bootstrap";
import $ from "jquery";
window.jQuery = $;
window.$ = $;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.handleLoading = this.handleLoading.bind(this);
    this.state = {
      loadingRemote: false,
    };
  }

  handleLoading(isLoading) {
    this.setState({ loadingRemote: isLoading });
  }

  render() {
    const validator = new ValidatorWorker();
    validator.onmessage = (e) => {
      console.log(e);
      if (e.data && e.data.error) {
        console.error(e.data.error);
        alert(`Error during validation ${e.data.error}`);
        return;
      }
    };
    return (
      <Provider store={store}>
        {this.state.loadingRemote && (
          <div className="d-flex align-items-center col-12 position-absolute h-100 w-100">
            <div className="mr-auto ml-auto">
              <h3>Validazione in corso</h3>
              <div
                className="spinner-grow text-primary"
                role="status"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        )}
        <Layout loadingRemote={this.state.loadingRemote}>
          <button onClick={() => validator.postMessage("")}>Validate</button>
          <Index onLoadingRemote={this.handleLoading} />
        </Layout>
      </Provider>
    );
  }
}

render(<App />, document.getElementById("app"));
