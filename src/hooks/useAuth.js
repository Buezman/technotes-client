import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isAdmin = false;
    let isManager = false;
    let status = "Employee";

    if (token) {
        const decoded = jwtDecode(token);
        const { username, roles } = decoded.UserInfo;
        isManager = roles.includes("Manager");
        isAdmin = roles.includes("Admin");

        if (isManager) status = "Manager";
        if (isAdmin) status = "Admin";

        return { username, roles, isAdmin, isManager, status };
    }

    return { username: "", isAdmin, isManager, status, roles: [] };
};

export default useAuth;
