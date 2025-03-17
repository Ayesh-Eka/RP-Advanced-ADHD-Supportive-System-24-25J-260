import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const TextChatbot = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [femaleVoice, setFemaleVoice] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [userResponses, setUserResponses] = useState([]); // Track user responses
  const navigate = useNavigate(); // Initialize useNavigate

  // Initialize speech synthesis and set female voice
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const loadVoices = () => {
        const voices = synth.getVoices();
        const femaleVoice = voices.find((voice) => voice.name.includes('Female') || voice.lang.includes('female'));
        setFemaleVoice(femaleVoice || voices[0]);
        setSpeechSynth(synth);
      };
      if (synth.getVoices().length > 0) {
        loadVoices();
      } else {
        synth.onvoiceschanged = loadVoices;
      }
    } else {
      Swal.fire('Warning', 'Text-to-speech is not supported in your browser.', 'warning');
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserResponse(transcript);
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        Swal.fire('Error', 'Speech recognition failed. Please try again.', 'error');
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      setSpeechRecognition(recognition);
    } else {
      Swal.fire('Warning', 'Speech recognition is not supported in your browser.', 'warning');
    }
  }, []);

  // Fetch 5 random questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/social-skills/questions');
        setQuestions(response.data.slice(0, 5)); // Limit to 5 questions
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        Swal.fire('Error', 'Failed to fetch questions.', 'error');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Speak the current question
  const speakQuestion = () => {
    if (speechSynth && questions[currentQuestionIndex] && femaleVoice) {
      const text = questions[currentQuestionIndex].scenario;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = femaleVoice;
      speechSynth.cancel();
      speechSynth.speak(utterance);
    }
  };

  // Automatically speak the question when it changes
  useEffect(() => {
    if (questions.length > 0 && !loading && femaleVoice) {
      speakQuestion();
    }
  }, [currentQuestionIndex, questions, loading, femaleVoice]);

  // Start speech recognition on button press
  const startListening = () => {
    if (speechRecognition) {
      setIsListening(true);
      speechRecognition.start();
    }
  };

  // Stop speech recognition on button release
  const stopListening = () => {
    if (speechRecognition) {
      speechRecognition.stop();
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!userResponse) {
      Swal.fire('Error', 'Please provide a response.', 'error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/social-skills/check-response', { text: userResponse });
      const { isPositive } = response.data;

      // Save the user's response
      setUserResponses((prevResponses) => [
        ...prevResponses,
        { question: questions[currentQuestionIndex].scenario, response: userResponse, isPositive },
      ]);

      if (isPositive) {
        const utterance = new SpeechSynthesisUtterance("Great job! Your response is correct.");
        utterance.voice = femaleVoice;
        speechSynth.speak(utterance);

        Swal.fire({
          title: 'Success',
          text: 'Great job! Your response is correct.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          if (currentQuestionIndex < 4) {
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            navigate('/feedback', { state: { userResponses } }); // Redirect to feedback page
          }
          setUserResponse('');
        });
      } else {
        const correctResponses = [
          questions[currentQuestionIndex].response1,
          questions[currentQuestionIndex].response2,
          questions[currentQuestionIndex].response3,
        ];

        const formattedSuggestions = correctResponses
          .map((response, index) => `${index + 1}. ${response}`)
          .join('<br>');

        const suggestionText = `Here are some better responses: ${correctResponses.join('. ')}`;
        const utterance = new SpeechSynthesisUtterance(suggestionText);
        utterance.voice = femaleVoice;
        speechSynth.speak(utterance);

        Swal.fire({
          title: 'Oops!',
          html: `Here are some better responses:<br>${formattedSuggestions}`,
          icon: 'info',
          confirmButtonText: 'OK'
        }).then(() => {
          if (currentQuestionIndex < 4) {
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            navigate('/feedback', { state: { userResponses } }); // Redirect to feedback page
          }
          setUserResponse('');
        });
      }
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
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            className={`p-2 ${
              isListening ? 'bg-red-500' : 'bg-purple-500'
            } text-white rounded hover:bg-purple-600`}
          >
            {isListening ? 'Listening... Release to Submit' : 'Press and Hold to Speak'}
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            onClick={speakQuestion}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Replay Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextChatbot;