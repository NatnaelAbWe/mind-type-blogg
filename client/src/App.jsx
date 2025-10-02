import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import UserAuthForm from "./pages/userAuthForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route path="/signin" element={<UserAuthForm type="signin" />} />
        <Route path="/signup" element={<UserAuthForm type="signup" />} />
      </Route>
    </Routes>
  );
}
export default App;
