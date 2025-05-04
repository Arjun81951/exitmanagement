import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import StudentHome from '../pages/studentHome';
import StudentQr from '../pages/studentQR';
import HodHome from '../pages/hodHome';
import SecurityHome from '../pages/securityHome';
import ScanResult from '../pages/scanResult';
import PayFees from '../pages/payfees';
import NotFound from'../pages/NotFound';
import TeacherHome from '../pages/teacherHome';
import Requests from '../pages/requests';
const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
};

const getRole = () => {
    return localStorage.getItem('role'); // Assuming roles are stored as 'student', 'hod', or 'security'
};

const LoginGuard = ({ children }) => {
    if (isAuthenticated()) {
        const role = getRole();
        if (role === 'student') return <Navigate to="/student" />;
        if (role === 'hod') return <Navigate to="/hod" />;
        if (role === 'security') return <Navigate to="/security" />;
        if (role === 'teacher') return <Navigate to="/teacher" />;
    }
    return children;
};

const AuthGuard = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" />;
};

const Router = () => {
    return (
        <>
        <Routes>
            <Route path="/" element={<LoginGuard><Login/></LoginGuard>}></Route>
            <Route path="/register" element={<LoginGuard><Register/></LoginGuard>}></Route>
            <Route path="/student" element={<AuthGuard><StudentHome/></AuthGuard>}></Route>
            <Route path="/student/qr" element={<AuthGuard><StudentQr/></AuthGuard>}></Route>
            <Route path="/hod" element={<AuthGuard><HodHome/></AuthGuard>}></Route>
            <Route path="/teacher" element={<AuthGuard><TeacherHome/></AuthGuard>}></Route>
            <Route path="/report" element={<AuthGuard><Requests/></AuthGuard>}></Route>
            <Route path="/qr" element={<AuthGuard><StudentQr/></AuthGuard>}></Route>
            <Route path="/security" element={<AuthGuard><SecurityHome/></AuthGuard>}></Route>
            <Route path="/result" element={<AuthGuard><ScanResult/></AuthGuard>}></Route>
            <Route path="/payfees" element={<AuthGuard><PayFees/></AuthGuard>}></Route>
            <Route path="/NotFound" element={<NotFound></NotFound>}></Route>
        </Routes>
        </>
    );
};
export default Router;