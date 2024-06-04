import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './Food.css';

// Set the workerSrc to load the PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Food = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPageNumber, setInputPageNumber] = useState(1);
  const [scale, setScale] = useState(0.4); // Default scale

  useEffect(() => {
    const savedPageNumber = localStorage.getItem('pageNumber');
    if (savedPageNumber) {
      setPageNumber(Number(savedPageNumber));
      setInputPageNumber(Number(savedPageNumber));
    }

    const handleResize = () => {
      if (window.innerWidth < 480) {
        setScale(0.24); // Adjust scale for tablets and small screens
      } else if (window.innerWidth < 768) {
        setScale(0.1); // Adjust scale for mobile screens
      } else {
        setScale(0.5); // Default scale for larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handleInputChange(e) {
    setInputPageNumber(e.target.value);
  }

  function handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      const page = Number(inputPageNumber);
      if (page >= 1 && page <= numPages) {
        setPageNumber(page);
        localStorage.setItem('pageNumber', page); // Save to local storage
      }
    }
  }

  return (
    <div className="pdf-viewer">
      <h1>ספר המתכונים שלנו</h1>
      <div className="pdf-container">
        <Document
          file={require('./data1.pdf')}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>
      <div className="page-controls">
        <p>
          עמוד <input
            type="number"
            value={inputPageNumber}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            min="1"
            max={numPages}
            className="page-input"
          /> מתוך {numPages}
        </p>
        <div className="navigation">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            קודם
          </button>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            הבא
          </button>
        </div>
      </div>
    </div>
  );
};

export default Food;
