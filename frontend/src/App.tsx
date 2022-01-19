import React from "react";
// eslint-disable-next-line import/no-unresolved
import "@aws-amplify/ui-react/styles.css";
import Home from "./pages/Home";
import { HashRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import AllNotes from "./pages/AllNotes";
import Note from "./Note";
import { UserProfileProvider } from "./context/UserProvider";

const App = () => {
  return (
    <UserProfileProvider>
      <HashRouter>
        <Header>
          <Switch>
            <Route path="/note/:note_id" component={Note} />
            <Route path="/notes" component={AllNotes} />
            <Route path="/" component={Home} />
          </Switch>
        </Header>
      </HashRouter>
    </UserProfileProvider>
  );
};

export default App;
