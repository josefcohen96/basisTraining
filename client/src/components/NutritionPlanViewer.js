import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import './NutritionPlanViewer.css';

// Set the workerSrc to load the PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const NutritionPlanViewer = () => {
  const { planId } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPageNumber, setInputPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const [scale, setScale] = useState(0.4); // Default scale

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/nutrition-plans/${planId}/pdf`);
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
  }, [planId]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    const savedPageNumber = localStorage.getItem(`pageNumber-${planId}`) || numPages;
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
        localStorage.setItem(`pageNumber-${planId}`, page); // Save to local storage
      }
    }
  }

  function handlePreviousPage() {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    setInputPageNumber(newPageNumber);
    localStorage.setItem(`pageNumber-${planId}`, newPageNumber); // Save to local storage
  }

  function handleNextPage() {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    setInputPageNumber(newPageNumber);
    localStorage.setItem(`pageNumber-${planId}`, newPageNumber); // Save to local storage
  }

  return (
    <div className="pdf-viewer">
      <h1>Nutrition Plan</h1>
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
          Page <input
            type="number"
            value={inputPageNumber}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            min="1"
            max={numPages}
            className="page-input"
          /> of {numPages}
        </p>
        <div className="navigation">
          <button
            disabled={pageNumber <= 1}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <button
            disabled={pageNumber >= numPages}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanViewer;
