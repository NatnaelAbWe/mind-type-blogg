import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import UserAuthForm from "./pages/userAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import UserNavigationPanel from "./components/UserNavigation";
import Editor from "./pages/Editor";
import HomePage from "./pages/HomePage";

export const userContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accessToken: null });
  }, []);
  return (
    <userContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<NavBar />}>
          <Route index element={<HomePage />} />
          <Route path="/signin" element={<UserAuthForm type="signin" />} />
          <Route path="/signup" element={<UserAuthForm type="signup" />} />
        </Route>
      </Routes>
    </userContext.Provider>
  );
}
export default App;
