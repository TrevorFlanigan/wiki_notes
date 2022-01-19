import React, { useEffect } from "react";
import NoteType from "../types/NoteType";
import makeNote from "../api/createNote";
import getAllNotes from "../api/getNotes";
import NoteCard from "../components/NoteCard";
import useAuth from "../context/useAuth";
const Home: React.FC = () => {
  const [notes, setNotes] = React.useState<NoteType[]>([]);
  const { user, isLoading } = useAuth();
  useEffect(() => {
    console.log("load");
    const load = async () => {
      const fetchedNotes = await getAllNotes();
      setNotes(fetchedNotes);
    };
    load();
  }, []);
  const handleCreateNote = async () => {
    console.log("create");
    const note = await makeNote({
      title: "New Note",
      body: "This is a new note",
    });
  };

  if (isLoading) {
    return <div className="loading w-8">Loading...</div>;
  }

  return (
    <div>
      home
      {notes.map((note, index) => {
        return <NoteCard key={index} note={note} />;
      })}
      <button className="rounded-btn" onClick={handleCreateNote}>
        {" "}
        create Note
      </button>
    </div>
  );
};

export default Home;
