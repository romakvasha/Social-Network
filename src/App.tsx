import React, { useEffect } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import "./App.css";
import Nav from "./components/NavBar/Nav";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import UsersPage from "./components/Users/UsersPage";
import Preloader from "./components/common/preloader/Preloader";
import News from "./components/News/News";
import Music from "./components/Music/Music";
import Settings from "./components/Settings/Settings";
import NotFound from "./components/NotFound/NotFound";
import {
  CHAT,
  DIALOGS,
  FINDUSERS,
  LOGIN,
  MUSIC,
  NEWS,
  PROFILE,
  PROFILE_ROUTE,
  SETTINGS,
} from "./components/NavBar/constants";
import { actions as appActions, initializeApp } from "./redux/app-reducer";
import store, { AppStateType } from "./redux/redux-store";
import { withSuspense } from "./hoc/withSuspense";

const DialogsContainer = React.lazy(() => import("./components/Dialogs/DialogsContainer"));
const ProfileContainer = React.lazy(() => import("./components/Profile/ProfileContainer"));
const ChatPage = React.lazy(() => import("./components/Chat/ChatPage"));

const SuspendedDialogs = withSuspense(DialogsContainer);
const SuspendedProfile = withSuspense(ProfileContainer);
const SuspendedChat = withSuspense(ChatPage);

const App: React.FC = () => {
  const dispatch = useDispatch<any>();
  const initialized = useSelector((state: AppStateType) => state.app.initialized);
  const globalError = useSelector((state: AppStateType) => state.app.globalError);

  useEffect(() => {
    dispatch(initializeApp());

    const catchAllUnhandledErrors = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const message = typeof reason === "string" ? reason : reason?.message || "Some error occurred";
      dispatch(appActions.setGlobalError(message));
    };
    window.addEventListener("unhandledrejection", catchAllUnhandledErrors);
    return () => window.removeEventListener("unhandledrejection", catchAllUnhandledErrors);
  }, [dispatch]);

  if (!initialized) {
    return <Preloader />;
  }

  return (
    <div className="app-wrapper">
      <Header />
      <Nav />
      <main className="app-wrapper-content">
        {globalError && (
          <div className="global-error" role="alert">
            <span>{globalError}</span>
            <button onClick={() => dispatch(appActions.setGlobalError(null))}>×</button>
          </div>
        )}
        <Switch>
          <Route exact path="/" render={() => <Redirect to={PROFILE} />} />
          <Route path={DIALOGS} render={() => <SuspendedDialogs />} />
          <Route path={PROFILE_ROUTE} render={() => <SuspendedProfile />} />
          <Route path={FINDUSERS} render={() => <UsersPage pageTitle="Знайти друзів" />} />
          <Route path={CHAT} render={() => <SuspendedChat />} />
          <Route path={NEWS} render={() => <News />} />
          <Route path={MUSIC} render={() => <Music />} />
          <Route path={SETTINGS} render={() => <Settings />} />
          <Route path={LOGIN} render={() => <Login />} />
          <Route path="*" render={() => <NotFound />} />
        </Switch>
      </main>
    </div>
  );
};

const MainApp: React.FC = () => {
  return (
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  );
};

export default MainApp;
