import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import UserRoutes from "./Routes/userRoutes";
import AdminRoutes from "./Routes/adminRoutes";
import CompanyRoutes from "./Routes/companyRoutes";
import InterviewModal from "./components/Common/CompanyCommon/IncomingInterViewModal";
function App() {
  return (
    <Router>

      <Routes>
        <Route path="/user/*" element={<UserRoutes />}></Route>
        <Route path="/company/*" element={<CompanyRoutes />}></Route>
        <Route path="/admin/*" element={<AdminRoutes />}></Route>
      </Routes>
    </Router>
  );
}

export default App;



