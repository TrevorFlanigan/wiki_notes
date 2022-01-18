import React from "react";
// eslint-disable-next-line import/no-unresolved
import "@aws-amplify/ui-react/styles.css";
import Home from "./pages/Home";
import { HashRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import AllNotes from "./pages/AllNotes";
import Note from "./Note";

const App = () => {
  return (
    <HashRouter>
      <Header>
        <Switch>
          <Route path="/notes" component={AllNotes} />
          <Route path="/" component={Note} />
        </Switch>
      </Header>
    </HashRouter>
  );
};

export default App;
