import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Header from "../components/Header";
import Note from "../Note";
import AllNotes from "./AllNotes";

const Home: React.FC = () => {
  const [title, setTitle] = React.useState("New Note");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

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

export default Home;
