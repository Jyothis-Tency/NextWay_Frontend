import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRoutes from "./Routes/userRoutes";
import AdminRoutes from "./Routes/adminRoutes";
import CompanyRoutes from "./Routes/companyRoutes";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoutes />}></Route>
        <Route path="/company/*" element={<CompanyRoutes />}></Route>
        <Route path="/admin/*" element={<AdminRoutes />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
