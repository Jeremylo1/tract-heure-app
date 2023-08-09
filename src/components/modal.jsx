import React from 'react'
import PropTypes from 'prop-types'

//Composant de la modale.
function Modal({ content, title, isOpen, onClose }) {
  return (
    <div>
      {isOpen ? (
        <div className="modal is-active">
          <div className="modal-background" onClick={onClose}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{title}</p>
              <button
                className="delete"
                aria-label="close"
                onClick={onClose}
              ></button>
            </header>
            <section className="modal-card-body">{content}</section>
          </div>
        </div>
      ) : null}
    </div>
  )
}

//Définition des props de la modale.
Modal.propTypes = {
  content: PropTypes.node,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
}

export default Modal
