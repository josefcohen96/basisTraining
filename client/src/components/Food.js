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
  const [pageNumber, setPageNumber] = useState(null);
  const [inputPageNumber, setInputPageNumber] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [scale, setScale] = useState(0.4); // Default scale

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pdf');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfFile(url);
      } catch (error) {
        console.error('Error fetching the PDF file:', error);
      }
    };

    fetchPdf();

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
    const savedPageNumber = localStorage.getItem('pageNumber') || numPages;
    setPageNumber(Number(savedPageNumber));
    setInputPageNumber(Number(savedPageNumber));
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

  function handlePreviousPage() {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    setInputPageNumber(newPageNumber);
    localStorage.setItem('pageNumber', newPageNumber); // Save to local storage
  }

  function handleNextPage() {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    setInputPageNumber(newPageNumber);
    localStorage.setItem('pageNumber', newPageNumber); // Save to local storage
  }

  return (
    <div className="pdf-viewer">
      <h1>ספר המתכונים שלנו</h1>
      <div className="pdf-container">
        {pdfFile && (
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {pageNumber && <Page pageNumber={pageNumber} scale={scale} />}
          </Document>
        )}
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
            onClick={handlePreviousPage}
          >
            קודם
          </button>
          <button
            disabled={pageNumber >= numPages}
            onClick={handleNextPage}
          >
            הבא
          </button>
        </div>
      </div>
    </div>
  );
};

export default Food;
