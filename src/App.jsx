import React, { useState, useEffect, useRef } from "react";
import he from "he";
import Button from "./components/button";
import Question from "./components/question";
import Form from "./components/form";
import largeBlueBlob from "../src/figures/large_blue_blob.svg";
import largeLemonyBlob from "../src/figures/large_lemony_blob.svg";
import smallBlueBlob from "../src/figures/small_blue_blob.svg";
import smallLemonyBlob from "../src/figures/small_lemony_blob.svg";
import Confetti from "react-confetti";

let TOTAL_QUESTIONS = 0,
  CORRECT_ANSWERS = 0;

export default function App() {
  const [APILink, setAPILink] = useState("");
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [questionElements, setQuestionElements] = useState([]);
  const [userResponses, setuserResponses] = useState([]);
  const userResponsesRef = useRef([]);
  const [answersKey, setAnswersKey] = useState({});
  const optionsElementsRef = useRef([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleFormEntries(formEntries) {
    const newAPI = `https://opentdb.com/api.php?amount=${formEntries.amount}${formEntries.category}${formEntries.difficulty}&type=multiple`;
    setAPILink(newAPI);
    toggleLandingPage();
  }

  useEffect(() => {
    if (!APILink) return;
    fetch(APILink)
      .then((res) => res.json())
      .then((data) => {
        TOTAL_QUESTIONS = data.results.length;
        setQuestionElements(generateQuestionElements(data.results));
        setAnswersKey(() => {
          const keys = {};
          data.results.forEach((question, index) => {
            question = {
              ...question,
              question: he.decode(question.question),
              incorrect_answers: question.incorrect_answers.map((option) =>
                he.decode(option)
              ),
              correct_answer: he.decode(question.correct_answer),
            };
            index++;
            keys[index] = question.correct_answer;
          });
          return keys;
        });
      });
  }, [APILink]);

  function generateQuestionElements(questions) {
    return questions.map((question) => {
      const q_num = questions.indexOf(question) + 1;
      // decoding the HTML
      question = {
        ...question,
        question: he.decode(question.question),
        incorrect_answers: question.incorrect_answers.map((option) =>
          he.decode(option)
        ),
        correct_answer: he.decode(question.correct_answer),
      };

      const options = [
        ...question.incorrect_answers,
        question.correct_answer,
      ].sort(() => Math.random() - 0.5);

      return (
        <Question
          key={q_num}
          q_num={q_num}
          question={question.question}
          options={options}
          onClick={updateUserResponse}
          onRef={(ref) => handleOptionsRef(ref)}
        />
      );
    });
  }

  const handleOptionsRef = (optionsRef) => {
    optionsElementsRef.current.push(optionsRef);
  };

  function toggleLandingPage() {
    setIsLandingPage((isLandingPage) => !isLandingPage);
  }

  function updateUserResponse(event) {
    const newResponse = {
      question: event.target.id,
      option: event.target.innerHTML,
      event: event,
    };

    // checking if the question is already answered
    const isAnswered = userResponsesRef.current.find(
      (response) => response.question === newResponse.question
    );

    if (isAnswered && isAnswered.option == newResponse.option) {
      toggleSelectedOption(event.target);
      filterResponse(newResponse);
      return;
    } else if (isAnswered) {
      toggleSelectedOption(isAnswered.event.target);
      filterResponse(isAnswered);
    }

    toggleSelectedOption(event.target);
    setuserResponses((prevResponses) => {
      const updatedRes = [...prevResponses, newResponse];
      userResponsesRef.current = updatedRes;
      return updatedRes;
    });
  }

  function filterResponse(newResponse) {
    setuserResponses((prevResponses) => {
      const filteredRes = prevResponses.filter((response) => {
        return newResponse.question != response.question;
      });
      userResponsesRef.current = filteredRes;
      return filteredRes;
    });
  }

  function toggleSelectedOption(target) {
    target.classList.toggle("selected");
  }

  //   Scoring
  function submitForScoring(event) {
    if (isSubmitted) {
      resetApp();
      return;
    }
    setIsSubmitted((isSubmitted) => !isSubmitted);

    // checking answered questions
    userResponses.forEach((res) => {
      if (answersKey[res.question] === res.option) {
        res.event.target.classList.add("corrected");
        CORRECT_ANSWERS++;
        delete answersKey[res.question];
      } else {
        res.event.target.classList.add("incorrected");
      }
      res.event.target.classList.remove("selected");
    });

    // highlighting correct answeres questions
    for (let q_num in answersKey) {
      const options = optionsElementsRef.current[q_num - 1].children;
      for (let option of options) {
        if (option.innerHTML == answersKey[q_num]) {
          option.classList.add("unanswered");
        }
      }
    }

    if (window.innerWidth <= 550)
      event.target.style.transform = "translateX(0)";
    else event.target.style.transform = "translateX(50%)";
  }

  // reset
  function resetApp() {
    TOTAL_QUESTIONS = 0;
    CORRECT_ANSWERS = 0;
    setAPILink("");
    setIsLandingPage(true);
    setQuestionElements([]);
    setuserResponses([]);
    userResponsesRef.current = [];
    setAnswersKey({});
    optionsElementsRef.current = [];
    setIsSubmitted(false);
  }

  return (
    <main className="main">
      {isSubmitted && CORRECT_ANSWERS == TOTAL_QUESTIONS && <Confetti />}
      <img
        src={isLandingPage ? largeLemonyBlob : smallLemonyBlob}
        className={`lemony-blob ${isLandingPage ? "" : "small-lemony-blob"}`}
        alt="Lemony Blob"
      />
      {isLandingPage && (
        <div className="landing-page">
          <h1>Quizzical</h1>
          <p>Test your knowledge with Quizzical!</p>
          <Form onSubmit={(formEntries) => handleFormEntries(formEntries)} />
        </div>
      )}
      {!isLandingPage && questionElements.length && (
        <div className="quiz-page">
          {questionElements}
          <div className="score-card-container">
            {
              <div className={`score-card ${isSubmitted ? "show-score" : ""}`}>
                You scored {CORRECT_ANSWERS}/{TOTAL_QUESTIONS} correct answers
              </div>
            }
            <Button
              text={isSubmitted ? "Play again" : "Submit"}
              onClick={submitForScoring}
            />
          </div>
        </div>
      )}

      <img
        src={isLandingPage ? largeBlueBlob : smallBlueBlob}
        className="blue-blob"
        alt="Blue Blob"
      />
    </main>
  );
}
