import React from "react";
import { useLocation } from "react-router-dom";
import NoteType from "./types/NoteType";

const Note = () => {
  const location = useLocation();
  const state = location.state as { note: NoteType };

  const [title, setTitle] = React.useState(
    state?.note.note_title || "New Note"
  );
  const [body, setBody] = React.useState(state?.note.note_body || "");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-800 p-5 text-black">
      <textarea
        placeholder="New Note"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        cols={1}
        className="w-full flex-shrink overflow-hidden mb-2"
        style={{
          lineHeight: "2rem",
          fontSize: "1.5rem",
        }}
      ></textarea>
      <div className="border-2 border-green-400 flex flex-col flex-1">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          style={{
            resize: "none",
            fontFamily: "Arial",
            flex: 1,
            height: "100%",
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default Note;
