import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PulseLoader } from "react-spinners";
import {
    faRightFromBracket,
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
    const { isManager, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [sendLogout, { isSuccess, isLoading, isError, error }] =
        useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate("/");
    }, [isSuccess, navigate]);

    const onLogoutClicked = () => sendLogout();

    const onNewUserClicked = () => navigate("/dash/users/new");
    const onNotesClicked = () => navigate("/dash/notes");
    const onUsersClicked = () => navigate("/dash/users");
    const onNewNoteClicked = () => navigate("/dash/notes/new");

    if (isLoading) return <p>...loading</p>;
    if (isError) return <p>Error:{error.data?.message}</p>;

    let dashClass = null;
    if (
        !DASH_REGEX.test(pathname) &&
        !NOTES_REGEX.test(pathname) &&
        USERS_REGEX.test(pathname)
    ) {
        dashClass = "dash-header__container-small";
    }

    let newNoteButton = null;
    if (NOTES_REGEX.test(pathname)) {
        newNoteButton = (
            <button
                className="icon-button"
                title="New Note"
                onClick={onNewNoteClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        );
    }

    let newUserButton = null;
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        );
    }

    let userButton = null;
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            );
        }
    }

    let notesButton = null;
    if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
        notesButton = (
            <button
                className="icon-button"
                title="Notes"
                onClick={onNotesClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        );
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="logout"
            onClick={onLogoutClicked}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );
    const errClass = isError ? "errmg" : "offscreen";

    let buttonContent;
    if (isLoading) {
        buttonContent = <PulseLoader color="#FFF" />;
    } else {
        buttonContent = (
            <>
                {newNoteButton}
                {newUserButton}
                {notesButton}
                {userButton}
                {logoutButton}
            </>
        );
    }
    return (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">technotes</h1>
                    </Link>
                    <nav className="dash-header__nav">{buttonContent}</nav>
                </div>
            </header>
        </>
    );
};

export default DashHeader;
