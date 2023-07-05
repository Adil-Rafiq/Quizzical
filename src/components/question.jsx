import React, { useEffect, useRef } from "react";

export default function Question({ q_num, question, options, onClick, onRef }) {
  useEffect(() => {
    // Call the callback function with the reference to the ul element
    onRef && onRef(optionsRef.current);
  }, [onRef]);

  const optionsRef = useRef(null);

  return (
    <div className="question-container" id={`${q_num}`}>
      <p className="title">{question}</p>
      <ul className="options" ref={optionsRef}>
        <li id={q_num} className="option" onClick={onClick}>
          {options[0]}
        </li>
        <li id={q_num} className="option" onClick={onClick}>
          {options[1]}
        </li>
        <li id={q_num} className="option" onClick={onClick}>
          {options[2]}
        </li>
        <li id={q_num} className="option" onClick={onClick}>
          {options[3]}
        </li>
      </ul>
      <span className="line"></span>
    </div>
  );
}
