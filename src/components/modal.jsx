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
            <section className="modal-card-body">
              <div>{content}</div>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  )
}

//Définition des props de la modale.
Modal.propTypes = {
  content: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Modal
