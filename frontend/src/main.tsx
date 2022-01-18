import React from "react";
import ReactDOM from "react-dom";
import Home from "./pages/Home";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports.js";
import App from "./App";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(awsconfig);

const AuthenticatorApp = withAuthenticator(App, {
  signUpAttributes: ["name", "email"],
});
ReactDOM.render(<AuthenticatorApp />, document.getElementById("root"));
