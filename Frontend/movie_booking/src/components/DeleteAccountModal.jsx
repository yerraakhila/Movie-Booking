import React from "react";

const Modal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" >
      <div className="modal-content"  style={{width:"600px"}}>
        <h2>Delete Account</h2>
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div className="modal-buttons">
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
