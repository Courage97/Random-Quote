import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TwitterShareButton, WhatsappShareButton, FacebookShareButton, TwitterIcon, WhatsappIcon, FacebookIcon } from 'react-share';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const baseURL = 'https://api.quotable.io/random';

const QuoteGenerator = () => {
  const [quote, setQuote] = useState('');
  const [quoteHistory, setQuoteHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [typingIndex, setTypingIndex] = useState(0);

  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get(baseURL);
      const { content, author } = response.data;
      setQuote(`${content} - ${author}`);
      setQuoteHistory((prevHistory) => [...prevHistory, `${content} - ${author}`]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTypingIndex(0); // Reset typing index for the new quote
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  useEffect(() => {
    try {
      fetchRandomQuote();
    } catch (error) {
      console.error('Fetching error quote', error);
    }
  }, []);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setTypingIndex((prevIndex) => prevIndex + 1);
    }, 50); // Adjust typing speed as needed

    // Clear the interval when the quote is fully typed
    if (typingIndex >= quote.length) {
      clearInterval(typingInterval);
    }

    return () => clearInterval(typingInterval); // Cleanup on component unmount or quote change
  }, [typingIndex, quote]);

  const handleNextQuote = () => {
    fetchRandomQuote();
  };

  const handlePreviousQuote = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setQuote(quoteHistory[currentIndex - 1]);
      setTypingIndex(0); // Reset typing index for the previous quote
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='p-8 rounded-lg w-full sm:w-96'>
        <blockquote className='text-white text-3xl sm:text-2xl font-semibold mb-6'>
          <FaQuoteLeft size={30} className='text-white' />
          <span className="inline-block">{quote.slice(0, typingIndex)}</span>
          <FaQuoteRight size={30} className='text-white' />
        </blockquote>
        <div className='flex flex-col sm:flex-row gap-4'>
          <button
            onClick={handlePreviousQuote}
            disabled={currentIndex <= 0}
            className='bg-orange-500 text-white px-4 py-1 rounded-lg text-base sm:text-lg border-2 border-white hover:bg-white hover:text-orange-500 hover:opacity-75 hover:ease-in-out hover:duration-300 hover:border-orange-500'
          >
            Prev
          </button>
          <button
            onClick={handleNextQuote}
            className='bg-green-500 text-white px-4 py-1 rounded-lg text-base sm:text-lg border-2 border-white hover:bg-white hover:text-green-500 hover:opacity-75 hover:ease-in-out hover:duration-300 hover:border-green-500'
          >
            Next
          </button>
        </div>
        <div className='flex flex-row my-6 gap-6'>
          <TwitterShareButton url='https://api.quotable.io/random' title={quote}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url='https://api.quotable.io/random' title={quote}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <FacebookShareButton url='https://api.quotable.io/random' title={quote}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
      </div>
      <h2 className='text-white'>Developer by Barnabas Oyewole @2023</h2>
    </div>
  );
};

export default QuoteGenerator;
