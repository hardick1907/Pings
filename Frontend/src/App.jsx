import { Routes,Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./Pages/Login";
import Signup from "./Pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Home from "./Pages/Home";
import { useThemeStore } from "./store/useThemeStore";
import SettingsPage from "./Pages/Settings";
import AddRoom from "./Pages/AddRoom";
import Rooms from "./Pages/Rooms";
import ChatBox from "./Pages/ChatBox";
import Profile from "./Pages/Profile";


const App = () => {

  const {authUser, checkAuth,isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if (isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/createRoom" element={authUser ? <AddRoom /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/rooms" element={authUser ? <Rooms /> : <Navigate to="/login" />} />
        <Route path={'/room/:id'} element={authUser ? <ChatBox /> : <Navigate to="/login" />} />
        <Route path={'/profile'} element={authUser ? <Profile /> : <Navigate to="/login" />} />
    </Routes>
    <Toaster position="top-center" reverseOrder={false}/>
    </div>

  )
}

export default App