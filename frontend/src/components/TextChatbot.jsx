import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TextChatbot = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [loading, setLoading] = useState(true);  // Track loading state for questions

  // Fetch 5 random questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/social-skills/questions');
        setQuestions(response.data);
        setLoading(false); // Set loading to false after questions are fetched
      } catch (error) {
        console.error('Error fetching questions:', error);
        Swal.fire('Error', 'Failed to fetch questions.', 'error');
        setLoading(false); // Ensure loading is turned off even on error
      }
    };

    fetchQuestions();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!userResponse) {
      Swal.fire('Error', 'Please provide a response.', 'error');
      return;
    }

    try {
      // Check if the response is positive
      const response = await axios.post('http://localhost:5000/api/social-skills/check-response', { text: userResponse });
      const { isPositive } = response.data;

      if (isPositive) {
        Swal.fire('Success', 'Great job! Your response is positive.', 'success');
      } else {
        const correctResponses = [
          questions[currentQuestionIndex].response1,
          questions[currentQuestionIndex].response2,
          questions[currentQuestionIndex].response3,
        ];
        Swal.fire('Oops!', `Here's a better response: ${correctResponses.join(' OR ')}`, 'info');
      }

      // Move to the next question
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length); // Wrap around to first question if end is reached
      setUserResponse('');
    } catch (error) {
      console.error('Error checking response:', error);
      Swal.fire('Error', 'Failed to check your response.', 'error');
    }
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available. Please try again later.</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return <div>You have completed all questions. Great job!</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Social Skills Chat</h1>
        <p className="mb-4">{currentQuestion.scenario}</p>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your response"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            className="w-full p-2 border rounded"
            required
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextChatbot;