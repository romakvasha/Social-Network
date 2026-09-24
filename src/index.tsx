import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainApp from "./App";
import { applyStoredTheme } from "./components/Settings/Settings";

applyStoredTheme();

ReactDOM.render(<MainApp />, document.getElementById("root"));
