// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import { authService } from "../services/auth.service";
// import { useAuth } from "../context/AuthContext";

// export const GoogleAuth: React.FC = () => {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();

//   const handleGoogleSuccess = async (credentialResponse: any) => {
//     try {
//       const response = await authService.googleAuth(
//         credentialResponse.credential
//       );
//       setUser(response.user);
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Google auth failed:", error);
//     }
//   };

//   return (
//     <div className="mt-4">
//       <GoogleLogin
//         onSuccess={handleGoogleSuccess}
//         onError={() => console.log("Login Failed")}
//       />
//     </div>
//   );
// };
