import React from "react";

export default function Button({ text, size, onClick }) {
  return (
    <button className={`gen-btn ${size}`} onClick={onClick}>
      {text}
    </button>
  );
}
