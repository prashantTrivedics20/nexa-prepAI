import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import '../styles/design-system.css';

function RandomPractice() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a question from AI Generator in localStorage
    const storedQuestion = localStorage.getItem('practiceQuestion');
    
    if (storedQuestion) {
      try {
        const question = JSON.parse(storedQuestion);
        // Clear the stored question
        localStorage.removeItem('practiceQuestion');
        
        // Navigate to practice page with the question data
        // Since AI-generated questions don't have an _id, we'll create a temporary practice session
        navigate('/practice/ai-generated', { state: { question } });
      } catch (error) {
        console.error('Failed to parse stored question:', error);
        fetchRandomQuestion();
      }
    } else {
      fetchRandomQuestion();
    }
  }, []);

  const fetchRandomQuestion = async () => {
    try {
      const response = await api.get('/questions/random');
      const question = response.data.data;
      navigate(`/practice/${question._id}`);
    } catch (error) {
      console.error('Failed to fetch random question:', error);
      alert('Failed to load random question. Please try again.');
      navigate('/questions');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <motion.div 
        style={{ 
          textAlign: 'center', 
          padding: '8rem 2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ 
            fontSize: '4rem', 
            marginBottom: '2rem',
            display: 'inline-block'
          }}
        >
          🎲
        </motion.div>
        <LoadingSpinner />
        <h2 style={{ 
          fontSize: 'var(--text-3xl)', 
          fontWeight: 'var(--font-bold)',
          color: 'var(--text-primary)',
          marginTop: '2rem',
          marginBottom: '1rem'
        }}>
          Finding a Random Question
        </h2>
        <p style={{ 
          fontSize: 'var(--text-lg)', 
          color: 'var(--text-secondary)',
          lineHeight: 'var(--leading-relaxed)'
        }}>
          Preparing a surprise question for you...
        </p>
      </motion.div>
    </div>
  );
}

export default RandomPractice;
