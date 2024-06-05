import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './VideoModal.css';

const VideoModal = ({ show, onHide, exercise }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{exercise.exercise_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="video-container">
          <video width="100%" height="315" controls>
            <source src={exercise.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p>{exercise.exercise_description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          סגור
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VideoModal;
