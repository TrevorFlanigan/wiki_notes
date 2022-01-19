import React from "react";
import { Link } from "react-router-dom";
import NoteType from "../types/NoteType";

type NoteCardProps = {
  note: NoteType;
};

const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <Link
      className="flex flex-col card card-bordered rounded-lg shadow-lg bg-gray-700 w-3/12 h-3/12 text-white"
      to={{ pathname: `note/${note.note_id}`, state: { note } }}
    >
      <div className="card-title text-center">{note.note_title}</div>
      <div className="card-body text-justify">{note.note_body}</div>
    </Link>
  );
};

export default NoteCard;
