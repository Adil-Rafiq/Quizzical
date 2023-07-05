import React, { useState } from "react";
import Button from "./button";

export default function Form({ onSubmit }) {
  const [amount, setAmount] = useState(5);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit({ amount, category, difficulty });
  };

  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <h3>Choose quiz specs</h3>
      <label htmlFor="amount">Number of questions: </label>
      <input
        type="number"
        name="amount"
        id="amount"
        defaultValue={5}
        min={1}
        max={10}
        onChange={(event) => setAmount(event.target.value)}
      />

      <label htmlFor="category">Select a category: </label>
      <select
        name="category"
        id="category"
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="">Any Category</option>
        <option value="&category=9">General Knowledge</option>
        <option value="&category=10">Books</option>
        <option value="&category=11">Films</option>
        <option value="&category=17">Science & Nature</option>
        <option value="&category=22">Geography</option>
        <option value="&category=23">History</option>
      </select>

      <label htmlFor="difficulty">Select difficulty: </label>
      <select
        name="difficulty"
        id="difficulty"
        onChange={(event) => setDifficulty(event.target.value)}
      >
        <option value="">Any Difficulty</option>
        <option value="&difficulty=easy">Easy</option>
        <option value="&difficulty=medium">Medium</option>
        <option value="&difficulty=hard">Hard</option>
      </select>

      <Button text="Start Quiz" size="large-btn" type="submit" />
    </form>
  );
}
