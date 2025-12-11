import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isLoggedIn, redirectTo = '/login' }) {
    if (!isLoggedIn) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}

export default ProtectedRoute;