import { useEffect, useRef, useState } from 'react';
import './App.css';
import CardList from './CardList';
import axios from 'axios';

const DEFAULT_NUMBER_OF_QUESTIONS = '10';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => setCategories(res.data.trivia_categories));
  }, []);

  useEffect(() => {
    axios
      .get('https://opentdb.com/api.php', {
        params: { amount: DEFAULT_NUMBER_OF_QUESTIONS }
      })
      .then(res => {
        const flashcardsContent = res.data.results.map((result, index) => {
          const id = `${index}-${Date.now()}`;
          const question = decodeString(result.question);
          const answer = decodeString(result.correct_answer);
          const options = [
            ...result.incorrect_answers.map(a => decodeString(a)),
            answer
          ];
          return {
            id,
            question,
            options: options.sort(() => Math.random() - 0.5),
            answer
          };
        });
        setFlashcards(flashcardsContent);
      });
  }, []);

  function decodeString(str) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value
        }
      })
      .then(res => {
        const flashcardsContent = res.data.results.map((result, index) => {
          const id = `${index}-${Date.now()}`;
          const question = decodeString(result.question);
          const answer = decodeString(result.correct_answer);
          const options = [
            ...result.incorrect_answers.map(a => decodeString(a)),
            answer
          ];
          return {
            id,
            question,
            options: options.sort(() => Math.random() - 0.5),
            answer
          };
        });
        setFlashcards(flashcardsContent);
      });
  }
  return (
    <>
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' ref={categoryEl}>
            {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='amount'>Number of questions</label>
          <input type='number' id='amount' min='1' step='1' defaultValue={DEFAULT_NUMBER_OF_QUESTIONS} ref={amountEl} />
        </div>
        <div className='form-group'>
          <button className='btn'>Generate</button>
        </div>
      </form>
      <div className="container">
        <CardList cardsContent={flashcards} />
      </div>
    </>
  );
}

export default App;
