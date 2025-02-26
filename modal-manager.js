/**
 * Enhanced Modal Manager with margin handling and animation support
 */
class ModalManager {
  constructor() {
    this.modalStack = [];
    this.stylesAdded = false;
    this.modalOptionsMap = {};
    this.instances = new Map();
    this.globalId = 1;
    this.lastFocusedElement = null;
    this.addGlobalStyles();
    this.setupModalCloseHandler();
    this.setupEscapeHandler();
    this.setupFocusTrap();
  }

  addGlobalStyles() {
    if (this.stylesAdded) return;
    const styles = `
      <style>
        .modal-backdrop { 
          z-index: 1040 !important;
          opacity: 0.5;
        }
        
        .modal {
          z-index: 1050 !important;
          padding-right: 0 !important;
        }
        
        .modal-open {
          overflow: hidden;
          padding-right: 0 !important;
        }
        
        .blur { 
          filter: blur(5px);
          transition: filter 0.3s ease-in-out;
        }
        
        .modal.fade .modal-dialog {
          transform: translate(0, -50px);
          transition: transform 0.3s ease-out;
        }
        
        .modal.show .modal-dialog {
          transform: none;
        }
        
        .modal-content {
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,.5);
          overflow: hidden;
        }

        .modal-header {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .modal-footer {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        .modal-closing {
          animation: modalClose 0.3s;
        }

        @keyframes modalClose {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.9); }
        }
        
        /* Size overrides to ensure consistent proportions */
        .modal-sm { max-width: 300px; }
        .modal-md { max-width: 500px; }
        .modal-lg { max-width: 800px; }
        .modal-xl { max-width: 1140px; }
        
        /* Ensure nested modals display properly */
        .modal-dialog {
          margin: 1.75rem auto;
          width: auto;
          max-width: var(--bs-modal-width);
        }

        /* Fix for refresh button */
        .refresh-button {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem 0.5rem;
          margin-right: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .refresh-button:hover {
          background-color: rgba(108, 117, 125, 0.1);
          color: #495057;
        }
        
        .refresh-button.spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* z-index incrementing for nested modals */
        .modal-level-1 {
          z-index: 1050 !important;
        }
        
        .modal-level-2 {
          z-index: 1060 !important;
        }
        
        .modal-level-3 {
          z-index: 1070 !important;
        }
        
        .modal-backdrop.level-1 {
          z-index: 1045 !important;
        }
        
        .modal-backdrop.level-2 {
          z-index: 1055 !important;
        }
        
        .modal-backdrop.level-3 {
          z-index: 1065 !important;
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
    this.stylesAdded = true;
  }

  generateUniqueId() {
    return `modal-${this.globalId++}`;
  }

  setupEscapeHandler() {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' && this.modalStack.length > 0) {
        this.closeTop();
      }
    });
  }

  setupModalCloseHandler() {
    document.addEventListener('hidden.bs.modal', (event) => {
      const modalId = event.target.id;
      if (modalId) {
        // Check if we need to refresh a previous modal
        const refreshPrevious = this.needToRefreshPrevious(modalId);
        const previousModalId = this.getPreviousModalId(modalId);
        
        // Remove from stack
        const index = this.modalStack.indexOf(modalId);
        if (index !== -1) {
          this.modalStack.splice(index, 1);
        }
        
        // Clean up references
        this.instances.delete(modalId);
        delete this.modalOptionsMap[modalId];
        
        // Update UI state
        if (this.modalStack.length === 0) {
          document.body.classList.remove('modal-open');
        } else {
          // Unblur the top modal
          this.updateTopModalBlur();
          
          // Refresh previous modal content if needed
          if (refreshPrevious && previousModalId) {
            this.handleModalClose(this.modalOptionsMap[modalId], previousModalId);
          }
        }
      }
    });

    window.addEventListener('popstate', () => {
      this.closeAll();
    });
  }

  setupFocusTrap() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && this.modalStack.length > 0) {
        const topModalId = this.modalStack[this.modalStack.length - 1];
        const topModal = document.getElementById(topModalId);
        if (!topModal) return;

        const focusableElements = topModal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  needToRefreshPrevious(modalId) {
    const options = this.modalOptionsMap[modalId];
    return options && options.bodyContentRefreshCloseModal === true;
  }

  getPreviousModalId(modalId) {
    const index = this.modalStack.indexOf(modalId);
    if (index > 0) {
      return this.modalStack[index - 1];
    }
    return null;
  }

  showModal(modalId) {
    if (!modalId) return null;
    
    // Make sure modal isn't already in the stack
    if (!this.modalStack.includes(modalId)) {
      this.modalStack.push(modalId);
    }
    
    document.body.classList.add('modal-open');

    const currentModal = document.getElementById(modalId);
    if (!currentModal) return null;

    // Store last focused element to restore focus when modal closes
    this.lastFocusedElement = document.activeElement;

    // Remove aria-hidden from the modal
    currentModal.removeAttribute('aria-hidden');

    // Set appropriate level class based on stack position
    currentModal.classList.remove('modal-level-1', 'modal-level-2', 'modal-level-3');
    const level = Math.min(this.modalStack.length, 3);
    currentModal.classList.add(`modal-level-${level}`);

    // Add aria-modal="true" to indicate this is a modal dialog
    currentModal.setAttribute('aria-modal', 'true');
    
    // Set focus to the first focusable element in the modal
    setTimeout(() => {
      const focusableElements = currentModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }, 50);

    // Apply blur effect to the previous modal if it exists
    if (this.modalStack.length > 1) {
      const previousModalId = this.modalStack[this.modalStack.length - 2];
      const previousModal = document.getElementById(previousModalId);
      if (previousModal) {
        const modalContent = previousModal.querySelector('.modal-content');
        if (modalContent) {
          modalContent.classList.add('blur');
        }
        // Add aria-hidden to previous modal
        previousModal.setAttribute('aria-hidden', 'true');
      }
    }

    try {
      // Create and show Bootstrap modal
      let modalInstance;
      try {
        modalInstance = bootstrap.Modal.getInstance(currentModal);
      } catch (e) {
        // Instance not found, create new one
      }
      
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(currentModal);
      }
      
      modalInstance.show();
      return currentModal;
    } catch (error) {
      console.error("Error showing modal:", error);
      return null;
    }
  }

  hideModal(modalId) {
    if (!modalId) return;

    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;

    try {
      let bootstrapModal;
      try {
        bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      } catch (e) {
        // No instance found
      }

      // Remove aria-modal and restore aria-hidden state
      modalElement.removeAttribute('aria-modal');
      modalElement.setAttribute('aria-hidden', 'true');
      
      if (bootstrapModal) {
        bootstrapModal.hide();
      } else {
        // Manual cleanup if Bootstrap instance not found
        modalElement.classList.add('modal-closing');
        
        modalElement.addEventListener('animationend', () => {
          modalElement.remove();
          
          // Update stack and UI state
          const index = this.modalStack.indexOf(modalId);
          if (index !== -1) {
            this.modalStack.splice(index, 1);
          }
          
          if (this.modalStack.length === 0) {
            document.body.classList.remove('modal-open');
            // Restore focus to last focused element when all modals are closed
            if (this.lastFocusedElement) {
              this.lastFocusedElement.focus();
            }
          } else {
            // Unblur the top modal and make it focusable
            this.updateTopModalBlur();
            const topModal = document.getElementById(this.modalStack[this.modalStack.length - 1]);
            if (topModal) {
              topModal.removeAttribute('aria-hidden');
              const focusableElements = topModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              );
              if (focusableElements.length) {
                focusableElements[0].focus();
              }
            }
          }
          
          this.instances.delete(modalId);
          delete this.modalOptionsMap[modalId];
        }, { once: true });
      }

    } catch (error) {
      console.error("Error removing modal:", error);
      // Fallback cleanup if the above fails
      modalElement.remove();
      
      const index = this.modalStack.indexOf(modalId);
      if (index !== -1) {
        this.modalStack.splice(index, 1);
      }
      
      if (this.modalStack.length === 0) {
        document.body.classList.remove('modal-open');
        // Restore focus to last focused element when all modals are closed
        if (this.lastFocusedElement) {
          this.lastFocusedElement.focus();
        }
      } else {
        // Unblur the top modal and make it focusable
        this.updateTopModalBlur();
        const topModal = document.getElementById(this.modalStack[this.modalStack.length - 1]);
        if (topModal) {
          topModal.removeAttribute('aria-hidden');
          const focusableElements = topModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length) {
            focusableElements[0].focus();
          }
        }
      }
      
      this.instances.delete(modalId);
      delete this.modalOptionsMap[modalId];
    }
  }

  updateTopModalBlur() {
    if (this.modalStack.length === 0) return;
    
    const topModalId = this.modalStack[this.modalStack.length - 1];
    const topModal = document.getElementById(topModalId);
    if (topModal) {
      const modalContent = topModal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.classList.remove('blur');
      }
    }
  }

  handleModalClose(options, previousModalId) {
    if (!options || !previousModalId) return;
    
    // If we need to refresh content in the parent modal
    const { bodyContentRefreshCloseModal = false } = options;
    
    if (bodyContentRefreshCloseModal) {
      const previousModal = document.getElementById(previousModalId);
      if (!previousModal) return;
      
      const modalBody = previousModal.querySelector('.modal-body');
      if (!modalBody) return;
      
      // If the modal has a refresh function, use it
      if (typeof window.modalCounter !== 'undefined') {
        modalBody.innerHTML = `
          <div class="p-3">
            <h5>Parent Modal with Counter</h5>
            <p>Current counter value: <strong>${window.modalCounter}</strong></p>
            <p>Open the child modal to increment this counter.</p>
            <p>When the child modal closes, this content will refresh automatically.</p>
          </div>
        `;
      }
    }
  }

  createModal(options = {}) {
    // Ensure we have a valid ID that won't cause selector issues
    const modalId = options.id || `modal-id-${this.generateUniqueId()}`;
    
    // Store options for later reference
    this.modalOptionsMap[modalId] = options;
    
    // If modal already exists, show it instead of creating a new one
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
      try {
        const modalDom = this.showModal(modalId);
        if (!modalDom) {
          console.error("Failed to show existing modal with ID:", modalId);
          return null;
        }
        
        return this.instances.get(modalId) || {
          id: modalId,
          rootEl: modalDom,
          contentEl: modalDom.querySelector('.modal-content'),
          closeEl: modalDom.querySelector('.btn-close'),
          isOpen: true,
          close: () => this.close(modalId)
        };
      } catch (error) {
        console.error("Error showing existing modal:", error);
      }
    }

    const modalHtml = this.generateModal(modalId, options);
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalElement = document.getElementById(modalId);

    if (!modalElement) {
      console.error("Failed to create modal element with ID:", modalId);
      return null;
    }

    if (options.loadContentUrl) {
      this.loadContentViaAjax(modalId, options.loadContentUrl, options.method || 'GET', 
                            options.csrfOption ?? false, options.data || null);
    }

    const modalDom = this.showModal(modalId);
    
    if (!modalDom) {
      console.error("Failed to show modal with ID:", modalId);
      return null;
    }

    const instance = {
      id: modalId,
      rootEl: modalDom,
      contentEl: modalDom.querySelector('.modal-content'),
      closeEl: modalDom.querySelector('.btn-close'),
      isOpen: true,
      close: () => this.close(modalId)
    };
    this.instances.set(modalId, instance);

    // Add open again buttons if specified
    if (options.showOpenAgain && Array.isArray(options.showOpenAgain)) {
      this.addButtonsToModal(modalId, options.showOpenAgain);
    }

    // Add close all button if specified
    if (options.showCloseAll) {
      const footer = modalDom.querySelector('.modal-footer');
      if (footer) {
        const closeAllButton = document.createElement('button');
        closeAllButton.type = 'button';
        closeAllButton.className = 'btn btn-danger ms-2';
        closeAllButton.textContent = 'Close All Modals';
        closeAllButton.onclick = () => this.closeAll();
        footer.appendChild(closeAllButton);
      }
    }

    // Add footerCallback if provided
    if (typeof options.footerCallback === 'function') {
      try {
        options.footerCallback(instance);
      } catch (error) {
        console.error("Error in footerCallback:", error);
      }
    }

    return instance;
  }

  generateModal(modalId, options) {
    return `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}-label" >
        <div class="modal-dialog modal-${options.size || 'md'}">
          <div class="modal-content">
            <div class="modal-header d-flex justify-content-between align-items-center">
              ${options.backArrow ? `
                <button type="button" class="btn btn-link text-decoration-none" data-bs-dismiss="modal" aria-label="Back" style="color: inherit; font-weight: bold;">
                  <i class="bi bi-arrow-left" style="font-size: 1.2rem; margin-right: 5px;"></i> Back
                </button>
              ` : ''}
              <h5 class="modal-title text-center flex-grow-1" id="${modalId}-label">${options.title || 'Default Title'}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${options.body || 'Default body content'}
            </div>
            <div class="modal-footer">
              ${options.submitForm ? 
                `<button type="button" class="btn btn-primary">${options.submitFormButtonText || 'Submit'}</button>` : 
                ''
              }
              ${options.footer || '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  addButtonsToModal(modalId, buttonConfigs) {
    if (!modalId || !buttonConfigs || !Array.isArray(buttonConfigs)) return;
    
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;
    
    const footer = modalElement.querySelector('.modal-footer');
    if (!footer) return;
    
    buttonConfigs.forEach(config => {
      if (!config) return;
      
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-primary mx-1';
      button.textContent = config.buttonText || 'Open Modal';

      button.addEventListener('click', () => {
        this.createModal({
          title: config.title || 'Dynamic Modal',
          id: config.id || '',
          size: config.size || 'md',
          submitForm: config.submitForm || false,
          bodyContentRefreshCloseModal: config.bodyContentRefreshCloseModal || false,
          submitFormButtonText: config.submitFormButtonText || 'Submit',
          backArrow: config.backArrow || false,
          loadContentUrl: config.loadContentUrl || '',
          body: config.body || 'Default body content',
          footer: config.footer || '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>',
          addModalId: config.addModalId || '',
          showCloseAll: config.showCloseAll || false,
          showOpenAgain: config.showOpenAgain || false,
          footerCallback: config.footerCallback
        });
      });
      
      footer.appendChild(button);
    });
  }

  closeAllModals() {
    const modalIds = [...this.modalStack]; // Make a copy to avoid mutation issues during iteration
    
    // Close each modal individually
    for (const modalId of modalIds) {
      this.hideModal(modalId);
    }
    
    // Clear the stack and cleanup
    this.modalStack = [];
    this.instances.clear();
    this.modalOptionsMap = {};
    
    // Ensure body class is removed
    document.body.classList.remove('modal-open');
    
    // Remove any lingering backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
  }

  loadContentViaAjax(modalId, url, method = 'GET', csrfOption = false, data = null) {
    if (!modalId || !url) return;
    
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="text-align: center;">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    const xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);

    if (csrfOption) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
      } else {
        console.warn('CSRF token not found. Ensure the meta tag is present.');
      }
    }

    if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        const modalBodyElement = document.querySelector(`#${modalId} .modal-body`);
        if (!modalBodyElement) return;
        
        if (xhr.status === 200) {
          try {
            // Try to parse as JSON first
            const jsonResponse = JSON.parse(xhr.responseText);
            modalBodyElement.innerHTML = `
              <div class="p-3">
                <h5>AJAX Response</h5>
                <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 300px; overflow-y: auto;">${JSON.stringify(jsonResponse, null, 2)}</pre>
              </div>
            `;
          } catch (e) {
            // If not JSON, display as HTML
            modalBodyElement.innerHTML = xhr.responseText;
          }
        } else {
          const errorMessage = xhr.responseText || 'Failed to load content. Please try again.';
          modalBodyElement.innerHTML = `
            <div class="alert alert-danger">
              ${errorMessage}
            </div>
          `;
        }
      }
    };

    xhr.onerror = function() {
      const modalBodyElement = document.querySelector(`#${modalId} .modal-body`);
      if (!modalBodyElement) return;
      
      const errorMessage = 'A network error occurred. Please check your connection.';
      modalBodyElement.innerHTML = `
        <div class="alert alert-danger">
          ${errorMessage}
        </div>
      `;
    };

    try {
      if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    } catch (error) {
      console.error("Error sending AJAX request:", error);
      modalBody.innerHTML = `
        <div class="alert alert-danger">
          Failed to send request: ${error.message}
        </div>
      `;
    }
  }

  open(options) {
    if (!options) return null;
    
    if (typeof options === 'string') {
      options = { body: options };
    }
    
    // Create a static ID instead of using Date.now() which can cause issues
    const modalId = options.id || `modal-id-${this.generateUniqueId()}`;
    const instance = this.createModal({...options, id: modalId});
    
    if (!instance) {
      console.error("Failed to create modal instance");
      return null;
    }
    
    return instance;
  }

  close(instanceOrId) {
    if (!instanceOrId) return false;
    
    const id = typeof instanceOrId === 'string' ? instanceOrId : instanceOrId.id;
    if (!id) return false;
    
    this.hideModal(id);
    return true;
  }

  closeTop() {
    if (this.modalStack.length === 0) return false;
    const topModalId = this.modalStack[this.modalStack.length - 1];
    return this.close(topModalId);
  }

  closeAll() {
    this.closeAllModals();
    return true;
  }

  getById(id) {
    return this.instances.get(id);
  }

  getAll() {
    return Object.fromEntries(this.instances);
  }

  get defaultOptions() {
    return {
      title: 'Modal Title',
      body: 'Modal Content',
      size: 'md',
      submitForm: false,
      submitFormButtonText: 'Submit',
      bodyContentRefreshCloseModal: false,
      backArrow: false,
      showCloseAll: false,
      loadContentUrl: '',
      addModalId: 'body',
      footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>',
      showOpenAgain: false,
      escapeButtonCloses: true,
      overlayClosesOnClick: true,
      showCloseButton: true,
      className: '',
      contentClassName: '',
      appendLocation: 'body'
    };
  }
}