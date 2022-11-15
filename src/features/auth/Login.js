import React from "react";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import usePersist from "../../hooks/usePersist";

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [persist, setPersist] = usePersist();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [username, password]);

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("In login submit");
        try {
            const { accessToken } = await login({
                username,
                password,
            }).unwrap();
            console.log(accessToken);
            dispatch(setCredentials({ accessToken }));
            setUsername("");
            setPassword("");
            navigate("/dash");
        } catch (err) {
            if (!err.status) setErrMsg("No server response");
            else if (err.status === 400)
                setErrMsg("Missing username or password");
            else if (err.status === 401) setErrMsg("Unauthorized");
            else setErrMsg(err?.data?.message);

            errRef.current.focus();
        }
    };

    const errClass = errMsg ? "errmsg" : "offscreen";

    if (isLoading) return <p>...loading</p>;

    const content = (
        <section className="public">
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">
                    {errMsg}
                </p>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordInput}
                        required
                    />
                    <button className="form__submit-button">Sign In</button>

                    <label htmlFor="persist" className="form__persist">
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            onChange={handleToggle}
                            checked={persist}
                        />
                        Trust this device
                    </label>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    );

    return content;
};

export default Login;
