import React from "react";
import { useGetNotesQuery } from "./notesApiSlice";
import NewNoteForm from "./NewNoteForm";
import { PulseLoader } from "react-spinners";

const NewNote = () => {
    const { users } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map((id) => data?.entities[id]),
        }),
    });

    if (!users?.length) return <PulseLoader color="#FFF" />;

    return <NewNoteForm users={users} />;
};

export default NewNote;
