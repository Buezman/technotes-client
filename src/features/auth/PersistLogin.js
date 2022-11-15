import { Outlet, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { useSelector } from "react-redux";
import usePersist from "../../hooks/usePersist";
import { selectCurrentToken } from "./authSlice";

import React from "react";

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);
    const [trueSuccess, setTrueSuccess] = useState(false);
    const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
        useRefreshMutation();

    useEffect(() => {
        if (
            effectRan.current === true ||
            process.env.NODE_ENV !== "development"
        ) {
            const verifyRefreshToken = async () => {
                console.log("...Verifying refresh token");
                try {
                    await refresh();
                    setTrueSuccess(true);
                } catch (err) {
                    console.error(err);
                }
            };

            if (!token && persist) verifyRefreshToken();
        }
        return () => (effectRan.current = true);
        // eslint-disable-next-line
    }, []);

    let content;
    if (!persist) {
        console.log("no persist");
        content = <Outlet />;
    } else if (isLoading) {
        console.log("...loading");
        content = <p>...Loading</p>;
    } else if (isError) {
        console.log("error");
        content = (
            <p className="errmsg">
                {`${error.data?.message} - `}
                <Link to="/login">Please login again</Link>
            </p>
        );
    } else if (isSuccess && trueSuccess) {
        console.log("success");
        content = <Outlet />;
    } else if (token && isUninitialized) {
        console.log("token & isUninitialized");
        content = <Outlet />;
    }

    return content;
};

export default PersistLogin;
