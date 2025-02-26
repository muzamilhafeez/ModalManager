
document.addEventListener('DOMContentLoaded', () => {
  const modalManager = new ModalManager();
  window.modalManager = modalManager; // For debugging

  // Example 1: Basic Modal
  document.getElementById('example1')?.addEventListener('click', () => {
    modalManager.open({
      title: 'Basic Modal Example',
      body: `
        <div class="p-3">
          <p>This is a simple modal with basic content.</p>
          <p>Modals are perfect for displaying focused content without leaving the page.</p>
          <div class="alert alert-info">
            <i class="bi bi-info-circle"></i> Click the X or the Close button to dismiss.
          </div>
        </div>
      `,
      size: 'md'
    });
  });

  // Example 2: Form Modal
  document.getElementById('example2')?.addEventListener('click', () => {
    const formModal = modalManager.open({
      title: 'Contact Form',
      body: `
        <form id="contactForm" class="p-3 needs-validation" novalidate>
          <div class="mb-3">
            <label for="nameInput" class="form-label">Name</label>
            <input type="text" class="form-control" id="nameInput" required>
            <div class="invalid-feedback">Please enter your name.</div>
          </div>
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email</label>
            <input type="email" class="form-control" id="emailInput" required>
            <div class="invalid-feedback">Please enter a valid email address.</div>
          </div>
          <div class="mb-3">
            <label for="messageInput" class="form-label">Message</label>
            <textarea class="form-control" id="messageInput" rows="3" required></textarea>
            <div class="invalid-feedback">Please enter your message.</div>
          </div>
        </form>
      `,
      submitForm: true,
      submitFormButtonText: 'Submit Form',
      footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>'
    });

    if (formModal && formModal.rootEl) {
      const submitButton = formModal.rootEl.querySelector('.btn-primary');
      submitButton.addEventListener('click', () => {
        const form = formModal.rootEl.querySelector('#contactForm');
        
        // Add Bootstrap validation classes
        form.classList.add('was-validated');
        
        if (form.checkValidity()) {
          // Show success message
          const modalBody = formModal.rootEl.querySelector('.modal-body');
          modalBody.innerHTML = `
            <div class="p-3 text-center">
              <div class="mb-3">
                <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
              </div>
              <h4>Form Submitted Successfully!</h4>
              <p>Thank you for your submission. We'll be in touch soon.</p>
            </div>
          `;
          
          // Update footer buttons
          const footer = formModal.rootEl.querySelector('.modal-footer');
          footer.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>';
        }
      });
    }
  });

  // Example 3: AJAX Content Loading
  document.getElementById('example3')?.addEventListener('click', () => {
    modalManager.open({
      title: 'AJAX Content Demo',
      body: '<div class="text-center p-5"><div class="spinner-border" role="status"></div><p class="mt-2">Loading content...</p></div>',
      size: 'lg',
      loadContentUrl: 'https://jsonplaceholder.typicode.com/posts/1',
      footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
    });
  });

  // Example 4: Nested Modals
  document.getElementById('example4')?.addEventListener('click', () => {
    modalManager.open({
      title: 'Parent Modal',
      body: `
        <div class="p-3">
          <h5>Modal Nesting Demo</h5>
          <p>This demonstrates how modals can be stacked on top of each other.</p>
          <p>Each modal in the stack is blurred when a new modal is opened.</p>
          <p>Click the button below to open a child modal.</p>
        </div>
      `,
      size: 'md',
      showOpenAgain: [
        {
          buttonText: 'Open Level 2 Modal',
          title: 'Level 2 Modal',
          body: `
            <div class="p-3">
              <h5>Second Level Modal</h5>
              <p>This is the second level in our modal stack.</p>
              <p>Notice how the parent modal is blurred behind this one.</p>
            </div>
          `,
          size: 'md',
          showOpenAgain: [
            {
              buttonText: 'Open Level 3 Modal',
              title: 'Level 3 Modal',
              body: `
                <div class="p-3">
                  <h5>Third Level Modal</h5>
                  <p>This is the third level in our modal stack.</p>
                  <p>Multiple levels of modals can be useful for complex workflows.</p>
                </div>
              `,
              size: 'md',
              showCloseAll: true
            }
          ]
        }
      ]
    });
  });

  // Example 5: Confirmation Dialog
  document.getElementById('example5')?.addEventListener('click', () => {
    const confirmModal = modalManager.open({
      title: 'Confirm Action',
      body: `
        <div class="p-3 text-center">
          <div class="mb-3">
            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
          </div>
          <h5>Are you sure you want to proceed?</h5>
          <p>This action cannot be undone. Please confirm to continue.</p>
        </div>
      `,
      size: 'sm',
      footer: `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="confirmAction" class="btn btn-danger">Yes, Proceed</button>
      `
    });

    if (confirmModal && confirmModal.rootEl) {
      const confirmButton = confirmModal.rootEl.querySelector('#confirmAction');
      confirmButton.addEventListener('click', () => {
        // Update dialog to show success
        const modalBody = confirmModal.rootEl.querySelector('.modal-body');
        modalBody.innerHTML = `
          <div class="p-3 text-center">
            <div class="mb-3">
              <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
            </div>
            <h5>Action Completed!</h5>
            <p>The requested action has been processed successfully.</p>
          </div>
        `;
        
        // Update footer buttons
        const footer = confirmModal.rootEl.querySelector('.modal-footer');
        footer.innerHTML = '<button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>';
      });
    }
  });

  // Example 6: Image Gallery
  document.getElementById('example6')?.addEventListener('click', () => {
    const images = [
      { src: 'https://picsum.photos/id/10/800/500', caption: 'Landscape with mountains and trees' },
      { src: 'https://picsum.photos/id/11/800/500', caption: 'Distant mountains with fog' },
      { src: 'https://picsum.photos/id/12/800/500', caption: 'Waterfall in the forest' },
      { src: 'https://picsum.photos/id/13/800/500', caption: 'Winding mountain road' },
      { src: 'https://picsum.photos/id/14/800/500', caption: 'Coastal scene with rocks' }
    ];
    
    let currentImageIndex = 0;
    
    const galleryModal = modalManager.open({
      title: 'Image Gallery',
      body: getGalleryContent(images, currentImageIndex),
      size: 'lg',
      footer: `
        <button type="button" id="prevImage" class="btn btn-outline-secondary" ${currentImageIndex === 0 ? 'disabled' : ''}>
          <i class="bi bi-arrow-left"></i> Previous
        </button>
        <button type="button" id="nextImage" class="btn btn-outline-secondary">
          Next <i class="bi bi-arrow-right"></i>
        </button>
        <button type="button" class="btn btn-secondary ms-auto" data-bs-dismiss="modal">Close</button>
      `
    });

    function getGalleryContent(images, index) {
      return `
        <div class="text-center p-3">
          <img src="${images[index].src}" alt="${images[index].caption}" class="img-fluid rounded mb-3" style="max-height: 60vh;">
          <p class="lead mb-0">${images[index].caption}</p>
          <p class="text-muted small">Image ${index + 1} of ${images.length}</p>
        </div>
      `;
    }

    if (galleryModal && galleryModal.rootEl) {
      const prevButton = galleryModal.rootEl.querySelector('#prevImage');
      const nextButton = galleryModal.rootEl.querySelector('#nextImage');
      
      prevButton.addEventListener('click', () => {
        if (currentImageIndex > 0) {
          currentImageIndex--;
          updateGallery();
        }
      });
      
      nextButton.addEventListener('click', () => {
        if (currentImageIndex < images.length - 1) {
          currentImageIndex++;
          updateGallery();
        }
      });
      
      function updateGallery() {
        const modalBody = galleryModal.rootEl.querySelector('.modal-body');
        modalBody.innerHTML = getGalleryContent(images, currentImageIndex);
        
        // Update button states
        prevButton.disabled = currentImageIndex === 0;
        nextButton.disabled = currentImageIndex === images.length - 1;
      }
    }
  });

  // Example 7: Video Player Modal
  document.getElementById('example7')?.addEventListener('click', () => {
    modalManager.open({
      title: 'Video Player',
      body: `
        <div class="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0" title="YouTube video player" 
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen></iframe>
        </div>
      `,
      size: 'lg',
      footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
    });
  });

  // Example 8: Multi-step Wizard
  document.getElementById('example8')?.addEventListener('click', () => {
    let currentStep = 1;
    const totalSteps = 3;
    
    const wizardModal = modalManager.open({
      title: 'Setup Wizard: Step 1 of 3',
      body: getStepContent(1),
      size: 'lg',
      footer: `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="nextStep" class="btn btn-primary">Next Step</button>
      `
    });

    function getStepContent(step) {
      switch(step) {
        case 1:
          return `
            <div class="p-3">
              <h5>Personal Information</h5>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 33%" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <div class="mb-3">
                <label for="wizardName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="wizardName">
              </div>
              <div class="mb-3">
                <label for="wizardEmail" class="form-label">Email Address</label>
                <input type="email" class="form-control" id="wizardEmail">
              </div>
            </div>
          `;
        case 2:
          return `
            <div class="p-3">
              <h5>Preferences</h5>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 66%" aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <div class="mb-3">
                <label class="form-label">Theme</label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="theme" id="themeLight" checked>
                  <label class="form-check-label" for="themeLight">Light</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="theme" id="themeDark">
                  <label class="form-check-label" for="themeDark">Dark</label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Notifications</label>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="notifyEmail" checked>
                  <label class="form-check-label" for="notifyEmail">Email Notifications</label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="notifyApp">
                  <label class="form-check-label" for="notifyApp">In-App Notifications</label>
                </div>
              </div>
            </div>
          `;
        case 3:
          return `
            <div class="p-3">
              <h5>Confirmation</h5>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <div class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i> All steps completed successfully!
              </div>
              <p>Please review your information before submitting:</p>
              <ul class="list-group mb-3">
                <li class="list-group-item d-flex justify-content-between">
                  <span>Name:</span>
                  <span class="text-muted">John Doe</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Email:</span>
                  <span class="text-muted">john@example.com</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Theme:</span>
                  <span class="text-muted">Light</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Email Notifications:</span>
                  <span class="text-muted">Enabled</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>In-App Notifications:</span>
                  <span class="text-muted">Disabled</span>
                </li>
              </ul>
            </div>
          `;
        default:
          return '<div class="p-3">Unknown step</div>';
      }
    }

    if (wizardModal && wizardModal.rootEl) {
      const updateButtons = () => {
        const footer = wizardModal.rootEl.querySelector('.modal-footer');
        
        if (currentStep === 1) {
          footer.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" id="nextStep" class="btn btn-primary">Next Step</button>
          `;
        } else if (currentStep < totalSteps) {
          footer.innerHTML = `
            <button type="button" id="prevStep" class="btn btn-secondary">Previous Step</button>
            <button type="button" id="nextStep" class="btn btn-primary">Next Step</button>
          `;
        } else {
          footer.innerHTML = `
            <button type="button" id="prevStep" class="btn btn-secondary">Previous Step</button>
            <button type="button" id="completeWizard" class="btn btn-success">Complete Setup</button>
          `;
        }
        
        // Re-add event listeners after updating buttons
        attachButtonListeners();
      };
      
      const attachButtonListeners = () => {
        const nextButton = wizardModal.rootEl.querySelector('#nextStep');
        const prevButton = wizardModal.rootEl.querySelector('#prevStep');
        const completeButton = wizardModal.rootEl.querySelector('#completeWizard');
        
        if (nextButton) {
          nextButton.addEventListener('click', () => {
            if (currentStep < totalSteps) {
              currentStep++;
              updateStep();
            }
          });
        }
        
        if (prevButton) {
          prevButton.addEventListener('click', () => {
            if (currentStep > 1) {
              currentStep--;
              updateStep();
            }
          });
        }
        
        if (completeButton) {
          completeButton.addEventListener('click', () => {
            // Show completion message
            const modalBody = wizardModal.rootEl.querySelector('.modal-body');
            modalBody.innerHTML = `
              <div class="p-3 text-center">
                <div class="mb-3">
                  <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                </div>
                <h4>Setup Complete!</h4>
                <p>Your account has been successfully configured.</p>
              </div>
            `;
            
            // Update footer
            const footer = wizardModal.rootEl.querySelector('.modal-footer');
            footer.innerHTML = `
              <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
            `;
          });
        }
      };
      
      const updateStep = () => {
        // Update title
        const modalTitle = wizardModal.rootEl.querySelector('.modal-title');
        modalTitle.textContent = `Setup Wizard: Step ${currentStep} of ${totalSteps}`;
        
        // Update body content
        const modalBody = wizardModal.rootEl.querySelector('.modal-body');
        modalBody.innerHTML = getStepContent(currentStep);
        
        // Update buttons
        updateButtons();
      };
      
      // Initial button setup
      attachButtonListeners();
    }
  });

  // Example 9: Dark Theme Modal
  document.getElementById('example9')?.addEventListener('click', () => {
    const darkModal = modalManager.open({
      title: 'Dark Mode Modal',
      body: `
        <div class="p-3">
          <h5>Dark Theme Support</h5>
          <p>This modal uses a dark color scheme for users who prefer dark interfaces.</p>
          <p>Dark mode can reduce eye strain and save battery on OLED displays.</p>
          <div class="mt-3">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="darkModeToggle" checked>
              <label class="form-check-label" for="darkModeToggle">Dark mode enabled</label>
            </div>
          </div>
        </div>
      `,
      size: 'md',
      footer: '<button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>'
    });
    
    if (darkModal && darkModal.rootEl) {
      const modalContent = darkModal.rootEl.querySelector('.modal-content');
      if (modalContent) {
        modalContent.classList.add('dark-mode-modal');
        
        // Add toggle functionality
        const toggleSwitch = darkModal.rootEl.querySelector('#darkModeToggle');
        if (toggleSwitch) {
          toggleSwitch.addEventListener('change', () => {
            if (toggleSwitch.checked) {
              modalContent.classList.add('dark-mode-modal');
            } else {
              modalContent.classList.remove('dark-mode-modal');
            }
          });
        }
      }
    }
  });

  // Example 10: Auto-close Modal
  document.getElementById('example10')?.addEventListener('click', () => {
    const autoCloseModal = modalManager.open({
      title: 'Auto-closing Modal',
      body: `
        <div class="p-3 text-center">
          <h5>This modal will close automatically</h5>
          <p>Remaining time: <span id="countdown">5</span> seconds</p>
          <div class="progress mt-3">
            <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
          </div>
        </div>
      `,
      size: 'sm',
      footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close Now</button>'
    });
    
    if (autoCloseModal && autoCloseModal.rootEl) {
      const countdownEl = autoCloseModal.rootEl.querySelector('#countdown');
      const progressBar = autoCloseModal.rootEl.querySelector('#progressBar');
      
      let secondsLeft = 5;
      
      const countdownInterval = setInterval(() => {
        secondsLeft--;
        
        if (countdownEl) {
          countdownEl.textContent = secondsLeft;
        }
        
        if (progressBar) {
          progressBar.style.width = `${(secondsLeft / 5) * 100}%`;
        }
        
        if (secondsLeft <= 0) {
          clearInterval(countdownInterval);
          modalManager.close(autoCloseModal);
        }
      }, 1000);
      
      // Clean up interval if modal is closed manually
      autoCloseModal.rootEl.addEventListener('hidden.bs.modal', () => {
        clearInterval(countdownInterval);
      });
    }
  });

  // Example 11: Refresh Parent Modal
  document.getElementById('example11')?.addEventListener('click', () => {
    // Initialize counter if not already set
    window.modalCounter = window.modalCounter || 0;
    
    const counterDisplay = () => {
      return `
        <div class="p-3">
          <h5>Parent Modal with Counter</h5>
          <p>Current counter value: <strong>${window.modalCounter}</strong></p>
          <p>Open the child modal to increment this counter.</p>
          <p>When the child modal closes, this content will refresh automatically.</p>
        </div>
      `;
    };
    
    const parentModal = modalManager.open({
      title: 'Previous Modal Refresh Demo',
      body: counterDisplay(),
      size: 'md',
      bodyContentRefreshCloseModal: true,
      showOpenAgain: [
        {
          buttonText: 'Open Child Modal',
          title: 'Increment Counter',
          body: `
            <div class="p-3">
              <h5>Child Modal</h5>
              <p>Click the increment button to update the counter.</p>
              <p>When you close this modal, the parent modal will refresh.</p>
              <button id="incrementCounter" class="btn btn-primary">Increment Counter</button>
            </div>
          `,
          footerCallback: (modal) => {
            if (!modal || !modal.rootEl) return;
            
            const incrementButton = modal.rootEl.querySelector('#incrementCounter');
            if (!incrementButton) return;
            
            const setupIncrementHandler = (button) => {
              button.addEventListener('click', () => {
                window.modalCounter = (window.modalCounter || 0) + 1;
                
                const modalBody = modal.rootEl.querySelector('.modal-body');
                if (!modalBody) return;
                
                modalBody.innerHTML = `
                  <div class="p-3">
                    <h5>Child Modal</h5>
                    <p>Counter incremented to: <strong>${window.modalCounter}</strong></p>
                    <p>Close this modal to see the update in the parent.</p>
                    <button id="incrementCounter" class="btn btn-primary">Increment Again</button>
                  </div>
                `;
                
                // Set up handler for the new button
                const newIncrementButton = modalBody.querySelector('#incrementCounter');
                if (newIncrementButton) {
                  setupIncrementHandler(newIncrementButton);
                }
              });
            };
            
            setupIncrementHandler(incrementButton);
          },
          bodyContentRefreshCloseModal: true
        }
      ]
    });
  });

  // Example 12: Close All Button
  document.getElementById('example12')?.addEventListener('click', () => {
    modalManager.open({
      title: 'Close All Demo',
      body: `
        <div class="p-3">
          <h5>Multiple Modal Management</h5>
          <p>This demo shows how to provide a "Close All" button in deeply nested modals.</p>
          <p>Open the nested modal chain and then use the "Close All Modals" button to dismiss the entire stack at once.</p>
        </div>
      `,
      size: 'md',
      showOpenAgain: [
        {
          buttonText: 'Open First Child',
          title: 'First Child Modal',
          body: `
            <div class="p-3">
              <h5>First Child Modal</h5>
              <p>This is the first child in our modal stack.</p>
              <p>Click the button below to open another child modal.</p>
            </div>
          `,
          showOpenAgain: [
            {
              buttonText: 'Open Second Child',
              title: 'Second Child Modal',
              body: `
                <div class="p-3">
                  <h5>Second Child Modal</h5>
                  <p>This is the second child in our modal stack.</p>
                  <p>You can continue nesting or use the "Close All Modals" button to dismiss the entire stack.</p>
                </div>
              `,
              showCloseAll: true
            }
          ]
        }
      ]
    });
  });

  // Example 13: Back Arrow Navigation
  document.getElementById('example13')?.addEventListener('click', () => {
    modalManager.open({
      title: 'Back Arrow Navigation',
      backArrow: true,
      body: `
        <div class="p-3">
          <h5>Back Navigation Feature</h5>
          <p>This modal includes a back arrow in the header that serves as an alternative to the close button.</p>
          <p>It's particularly useful for multi-step processes or workflows where users expect to be able to navigate backward.</p>
        </div>
      `,
      size: 'md',
      showOpenAgain: [
        {
          buttonText: 'Open Next Screen',
          title: 'Step 2',
          backArrow: true,
          body: `
            <div class="p-3">
              <h5>Second Screen</h5>
              <p>This is the second screen in our navigation flow.</p>
              <p>Notice the back arrow in the top left - click it to return to the previous screen.</p>
            </div>
          `,
          showOpenAgain: [
            {
              buttonText: 'Continue to Final Step',
              title: 'Step 3 (Final)',
              backArrow: true,
              body: `
                <div class="p-3">
                  <h5>Final Screen</h5>
                  <p>This is the final screen in our navigation flow.</p>
                  <p>You can use the back arrow to return to the previous screen, or close the modal to exit.</p>
                </div>
              `
            }
          ]
        }
      ]
    });
  });

  // Example 14: Custom Animation
  document.getElementById('example14')?.addEventListener('click', () => {
    const animatedModal = modalManager.open({
      title: 'Custom Animation Modal',
      body: `
        <div class="p-3">
          <h5>Animated Entrance</h5>
          <p>This modal demonstrates a custom animation when opening.</p>
          <p>Custom animations can help draw attention to important content.</p>
          <div class="text-center mt-4">
            <button id="animateAgain" class="btn btn-outline-primary">
              <i class="bi bi-arrow-repeat"></i> Animate Again
            </button>
          </div>
        </div>
      `,
      size: 'md'
    });
    
    if (animatedModal && animatedModal.contentEl) {
      animatedModal.contentEl.classList.add('animated-entrance');
      
      // Add button functionality
      if (animatedModal.rootEl) {
        const animateButton = animatedModal.rootEl.querySelector('#animateAgain');
        if (animateButton) {
          animateButton.addEventListener('click', () => {
            animatedModal.contentEl.classList.remove('animated-entrance');
            // Force reflow
            void animatedModal.contentEl.offsetWidth;
            animatedModal.contentEl.classList.add('animated-entrance');
          });
        }
      }
    }
  });

  // Example 15: Auto-refresh Content
  document.getElementById('example15')?.addEventListener('click', () => {
    // Function to generate content with current time
    const getRefreshableContent = () => {
      const now = new Date().toLocaleTimeString();
      return `
        <div class="p-3">
          <h5>Auto-Refreshing Content</h5>
          <p>Current time: <strong>${now}</strong></p>
          <p>This content updates automatically every 3 seconds.</p>
          <div class="progress mt-3">
            <div id="refreshProgress" class="progress-bar progress-bar-striped" style="width: 100%"></div>
          </div>
          <div class="alert alert-info mt-3">
            <i class="bi bi-info-circle me-2"></i> You can also manually refresh using the button in the header.
          </div>
        </div>
      `;
    };
    
    // Create unique ID
    const refreshModalId = `refresh-modal-${modalManager.generateUniqueId()}`;
    
    // Create the modal
    const modal = modalManager.open({
      id: refreshModalId,
      title: 'Auto-Refreshing Content',
      body: getRefreshableContent(),
      size: 'md',
      footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
    });
    
    if (!modal || !modal.rootEl) {
      console.error("Failed to create refresh modal");
      return;
    }
    
    // Add a refresh button to the modal header
    const modalHeader = modal.rootEl.querySelector('.modal-header');
    if (modalHeader) {
      const refreshButton = document.createElement('button');
      refreshButton.className = 'refresh-button';
      refreshButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
      refreshButton.title = 'Refresh content';
      
      const closeButton = modalHeader.querySelector('.btn-close');
      if (closeButton) {
        modalHeader.insertBefore(refreshButton, closeButton);
      } else {
        modalHeader.appendChild(refreshButton);
      }
      
      // Manual refresh on click
      refreshButton.addEventListener('click', () => {
        refreshButton.classList.add('spinning');
        setTimeout(() => {
          const modalBody = modal.rootEl.querySelector('.modal-body');
          if (modalBody) {
            modalBody.innerHTML = getRefreshableContent();
            startProgressBar();
          }
          refreshButton.classList.remove('spinning');
        }, 600);
      });
    }
    
    // Progress bar animation
    const startProgressBar = () => {
      const progressBar = modal.rootEl.querySelector('#refreshProgress');
      if (!progressBar) return;
      
      let width = 100;
      const refreshInterval = 3000; // 3 seconds
      const decrementStep = 100 / (refreshInterval / 50); // Update every 50ms
      
      progressBar.style.width = '100%';
      
      const interval = setInterval(() => {
        width -= decrementStep;
        
        if (width <= 0) {
          width = 0;
        }
        
        progressBar.style.width = width + '%';
      }, 50);
      
      // Clear interval and reset on completion
      setTimeout(() => {
        clearInterval(interval);
      }, refreshInterval);
    };
    
    startProgressBar();
    
    // Set up auto-refresh
    let refreshInterval;
    
    const startAutoRefresh = () => {
      refreshInterval = setInterval(() => {
        // Check if modal still exists in DOM
        if (!document.getElementById(refreshModalId)) {
          clearInterval(refreshInterval);
          return;
        }
        
        // Update content
        const modalBody = modal.rootEl.querySelector('.modal-body');
        if (modalBody) {
          const refreshButton = modalHeader.querySelector('.refresh-button');
          if (refreshButton) {
            refreshButton.classList.add('spinning');
          }
          
          setTimeout(() => {
            modalBody.innerHTML = getRefreshableContent();
            startProgressBar();
            
            if (refreshButton) {
              refreshButton.classList.remove('spinning');
            }
          }, 300);
        }
      }, 3000);
    };
    
    startAutoRefresh();
    
    // Clean up interval when modal closes
    modal.rootEl.addEventListener('hidden.bs.modal', () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });
  });

  // Example 16: Custom Size Modal
  document.getElementById('example16')?.addEventListener('click', () => {
    const sizeOptions = [
      { id: 'sizeXS', label: 'Extra Small', size: 'sm', width: '300px' },
      { id: 'sizeSM', label: 'Small', size: 'sm', width: '400px' },
      { id: 'sizeMD', label: 'Medium', size: 'md', width: '500px' },
      { id: 'sizeLG', label: 'Large', size: 'lg', width: '800px' },
      { id: 'sizeXL', label: 'Extra Large', size: 'xl', width: '1140px' }
    ];
    
    // Create a demo modal to showcase the sizes
    const sizeModal = modalManager.open({
      title: 'Modal Size Options',
      body: `
        <div class="p-3">
          <h5>Choose a Size</h5>
          <p>Click on the buttons below to see different modal sizes:</p>
          <div class="d-flex flex-wrap gap-2 my-3">
            ${sizeOptions.map(option => `
              <button id="${option.id}" class="btn btn-outline-primary">
                ${option.label}
              </button>
            `).join('')}
          </div>
          <div class="alert alert-info mt-3">
            <i class="bi bi-info-circle me-2"></i> The current modal size is <strong>Medium (md)</strong>.
          </div>
        </div>
      `,
      size: 'md'
    });
    
    if (sizeModal && sizeModal.rootEl) {
      // Add click handlers for each size button
      sizeOptions.forEach(option => {
        const button = sizeModal.rootEl.querySelector(`#${option.id}`);
        if (button) {
          button.addEventListener('click', () => {
            modalManager.open({
              title: `${option.label} Modal Example`,
              body: `
                <div class="p-3">
                  <h5>${option.label} Modal (${option.size})</h5>
                  <p>This modal is set to the ${option.label.toLowerCase()} size.</p>
                  <p>Width: ~${option.width}</p>
                  <div class="alert alert-secondary text-center py-5 my-3">
                    Content area demonstrates the available space
                  </div>
                </div>
              `,
              size: option.size
            });
          });
        }
      });
    }
  });

  // Example 17: Login/Register Modal
  document.getElementById('example17')?.addEventListener('click', () => {
    // Show login form initially
    const authModal = modalManager.open({
      title: 'Account Access',
      body: getLoginForm(),
      size: 'md',
      footer: `
        <button type="button" class="btn btn-link" id="switchToRegister">Create Account</button>
        <button type="button" id="loginButton" class="btn btn-primary">Log In</button>
      `
    });
    
    function getLoginForm() {
      return `
        <div class="p-3">
          <form id="loginForm">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Email address</label>
              <input type="email" class="form-control" id="loginEmail" required>
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">Password</label>
              <input type="password" class="form-control" id="loginPassword" required>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe">
              <label class="form-check-label" for="rememberMe">Remember me</label>
            </div>
            <div class="text-end">
              <a href="#" id="forgotPassword">Forgot password?</a>
            </div>
          </form>
        </div>
      `;
    }
    
    function getRegisterForm() {
      return `
        <div class="p-3">
          <form id="registerForm">
            <div class="mb-3">
              <label for="registerName" class="form-label">Full Name</label>
              <input type="text" class="form-control" id="registerName" required>
            </div>
            <div class="mb-3">
              <label for="registerEmail" class="form-label">Email address</label>
              <input type="email" class="form-control" id="registerEmail" required>
            </div>
            <div class="mb-3">
              <label for="registerPassword" class="form-label">Password</label>
              <input type="password" class="form-control" id="registerPassword" required>
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input type="password" class="form-control" id="confirmPassword" required>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="termsAgree" required>
              <label class="form-check-label" for="termsAgree">I agree to the terms and conditions</label>
            </div>
          </form>
        </div>
      `;
    }
    
    function getSuccessMessage(isLogin) {
      return `
        <div class="p-4 text-center">
          <div class="mb-4">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
          </div>
          <h4>${isLogin ? 'Login Successful!' : 'Registration Complete!'}</h4>
          <p class="lead mb-4">${isLogin ? 'Welcome back! You are now logged in.' : 'Your account has been created successfully!'}</p>
        </div>
      `;
    }
    
    function getForgotPasswordForm() {
      return `
        <div class="p-3">
          <h5>Reset Your Password</h5>
          <p>Enter your email address and we'll send you instructions to reset your password.</p>
          <form id="resetForm">
            <div class="mb-3">
              <label for="resetEmail" class="form-label">Email address</label>
              <input type="email" class="form-control" id="resetEmail" required>
            </div>
          </form>
        </div>
      `;
    }
    
    if (authModal && authModal.rootEl) {
      // Switch between login and register
      const switchToRegister = authModal.rootEl.querySelector('#switchToRegister');
      if (switchToRegister) {
        switchToRegister.addEventListener('click', () => {
          // Update body with register form
          const modalBody = authModal.rootEl.querySelector('.modal-body');
          if (modalBody) {
            modalBody.innerHTML = getRegisterForm();
          }
          
          // Update title
          const modalTitle = authModal.rootEl.querySelector('.modal-title');
          if (modalTitle) {
            modalTitle.textContent = 'Create an Account';
          }
          
          // Update footer buttons
          const footer = authModal.rootEl.querySelector('.modal-footer');
          if (footer) {
            footer.innerHTML = `
              <button type="button" class="btn btn-link" id="switchToLogin">Already have an account</button>
              <button type="button" class="btn btn-primary" id="registerButton">Sign Up</button>
            `;
            
            // Add handler for switching back to login
            const switchToLogin = footer.querySelector('#switchToLogin');
            if (switchToLogin) {
              switchToLogin.addEventListener('click', () => {
                // Update body with login form
                modalBody.innerHTML = getLoginForm();
                
                // Update title
                modalTitle.textContent = 'Account Access';
                
                // Update footer buttons
                footer.innerHTML = `
                  <button type="button" class="btn btn-link" id="switchToRegister">Create Account</button>
                  <button type="button" class="btn btn-primary" id="loginButton">Log In</button>
                `;
                
                // Reattach event listeners for the new elements
                attachLoginListeners();
              });
            }
            
            // Add handler for register button
            const registerButton = footer.querySelector('#registerButton');
            if (registerButton) {
              registerButton.addEventListener('click', () => {
                const registerForm = modalBody.querySelector('#registerForm');
                if (registerForm) {
                  registerForm.classList.add('was-validated');
                  
                  if (registerForm.checkValidity()) {
                    modalBody.innerHTML = getSuccessMessage(false);
                    footer.innerHTML = `
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Continue</button>
                    `;
                  }
                }
              });
            }
          }
        });
      }
      
      // Attach handlers for login form
      function attachLoginListeners() {
        const loginButton = authModal.rootEl.querySelector('#loginButton');
        const forgotPasswordLink = authModal.rootEl.querySelector('#forgotPassword');
        
        if (loginButton) {
          loginButton.addEventListener('click', () => {
            const loginForm = authModal.rootEl.querySelector('#loginForm');
            if (loginForm) {
              loginForm.classList.add('was-validated');
              
              if (loginForm.checkValidity()) {
                const modalBody = authModal.rootEl.querySelector('.modal-body');
                const footer = authModal.rootEl.querySelector('.modal-footer');
                
                modalBody.innerHTML = getSuccessMessage(true);
                
                if (footer) {
                  footer.innerHTML = `
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">Continue to Dashboard</button>
                  `;
                }
              }
            }
          });
        }
        
        if (forgotPasswordLink) {
          forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            const modalBody = authModal.rootEl.querySelector('.modal-body');
            const modalTitle = authModal.rootEl.querySelector('.modal-title');
            const footer = authModal.rootEl.querySelector('.modal-footer');
            
            if (modalBody) {
              modalBody.innerHTML = getForgotPasswordForm();
            }
            
            if (modalTitle) {
              modalTitle.textContent = 'Forgot Password';
            }
            
            if (footer) {
              footer.innerHTML = `
                <button type="button" class="btn btn-link" id="backToLogin">Back to Login</button>
                <button type="button" class="btn btn-primary" id="sendResetButton">Send Reset Link</button>
              `;
              
              // Add handler for back to login
              const backToLogin = footer.querySelector('#backToLogin');
              if (backToLogin) {
                backToLogin.addEventListener('click', () => {
                  modalBody.innerHTML = getLoginForm();
                  modalTitle.textContent = 'Account Access';
                  footer.innerHTML = `
                    <button type="button" class="btn btn-link" id="switchToRegister">Create Account</button>
                    <button type="button" class="btn btn-primary" id="loginButton">Log In</button>
                  `;
                  attachLoginListeners();
                });
              }
              
              // Add handler for send reset link
              const sendResetButton = footer.querySelector('#sendResetButton');
              if (sendResetButton) {
                sendResetButton.addEventListener('click', () => {
                  const resetForm = modalBody.querySelector('#resetForm');
                  if (resetForm) {
                    resetForm.classList.add('was-validated');
                    
                    if (resetForm.checkValidity()) {
                      modalBody.innerHTML = `
                        <div class="p-4 text-center">
                          <div class="mb-4">
                            <i class="bi bi-envelope-check-fill text-success" style="font-size: 4rem;"></i>
                          </div>
                          <h4>Reset Link Sent!</h4>
                          <p class="lead mb-4">We've sent instructions to reset your password to your email. Please check your inbox.</p>
                        </div>
                      `;
                      
                      footer.innerHTML = `
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      `;
                    }
                  }
                });
              }
            }
          });
        }
      }
      
      // Initial attachment of login listeners
      attachLoginListeners();
    }
  });

  // Example 18: Map Modal
  document.getElementById('example18')?.addEventListener('click', () => {
    // Define the SVG map
    const svgMap = `
      <svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="500" height="300" fill="#e0e8f0" />
        
        <!-- Countries/Regions with hover effect -->
        <g class="map-regions">
          <!-- Region 1 -->
          <path 
            d="M50,50 L150,50 L150,150 L50,150 Z" 
            fill="#a3c9e0" 
            stroke="#2b6a9b" 
            stroke-width="2" 
            class="region" 
            data-region="North"
          />
          <!-- Region 2 -->
          <path 
            d="M170,50 L270,50 L270,150 L170,150 Z" 
            fill="#a3e0b9" 
            stroke="#2b9b6a" 
            stroke-width="2" 
            class="region" 
            data-region="East"
          />
          <!-- Region 3 -->
          <path 
            d="M50,170 L150,170 L150,270 L50,270 Z" 
            fill="#e0d5a3" 
            stroke="#9b892b" 
            stroke-width="2" 
            class="region" 
            data-region="West"
          />
          <!-- Region 4 -->
          <path 
            d="M170,170 L270,170 L270,270 L170,270 Z" 
            fill="#e0a3a3" 
            stroke="#9b2b2b" 
            stroke-width="2" 
            class="region" 
            data-region="South"
          />
          <!-- Region 5 (Center) -->
          <circle 
            cx="320" 
            cy="160" 
            r="60" 
            fill="#d9a3e0" 
            stroke="#7b2b9b" 
            stroke-width="2" 
            class="region" 
            data-region="Central"
          />
        </g>
        
        <!-- Labels -->
        <g class="map-labels" fill="#000" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold">
          <text x="100" y="105">North</text>
          <text x="220" y="105">East</text>
          <text x="100" y="225">West</text>
          <text x="220" y="225">South</text>
          <text x="320" y="165">Central</text>
        </g>
      </svg>
    `;
    
    // Create the map modal
    const mapModal = modalManager.open({
      title: 'Interactive Map',
      body: `
        <div class="p-3">
          <div class="map-container">
            ${svgMap}
          </div>
          <div class="mt-3 p-3 bg-light rounded" id="region-info">
            <p class="mb-0">Click on a region to view details.</p>
          </div>
          <style>
            .map-container { max-width: 100%; overflow: auto; }
            .region { cursor: pointer; transition: fill 0.3s; }
            .region:hover { fill: #ffccaa; }
          </style>
        </div>
      `,
      size: 'lg'
    });
    
    if (mapModal && mapModal.rootEl) {
      // Region data for demo
      const regionData = {
        'North': {
          population: '2.4 million',
          capital: 'Northville',
          industries: 'Technology, Fishing, Tourism'
        },
        'East': {
          population: '3.1 million',
          capital: 'Eastport',
          industries: 'Finance, Manufacturing, Agriculture'
        },
        'West': {
          population: '1.8 million',
          capital: 'Westborough',
          industries: 'Mining, Energy, Entertainment'
        },
        'South': {
          population: '2.7 million',
          capital: 'Southland',
          industries: 'Agriculture, Tourism, Textiles'
        },
        'Central': {
          population: '4.5 million',
          capital: 'Centerfield',
          industries: 'Government, Education, Healthcare'
        }
      };
      
      // Add click handlers for the regions
      const regions = mapModal.rootEl.querySelectorAll('.region');
      const infoBox = mapModal.rootEl.querySelector('#region-info');
      
      regions.forEach(region => {
        region.addEventListener('click', () => {
          const regionName = region.getAttribute('data-region');
          const data = regionData[regionName];
          
          if (infoBox && data) {
            infoBox.innerHTML = `
              <h5>${regionName} Region</h5>
              <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <strong>Capital:</strong> <span>${data.capital}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <strong>Population:</strong> <span>${data.population}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <strong>Industries:</strong> <span>${data.industries}</span>
                </li>
              </ul>
            `;
          }
          
          // Reset all regions to their original fill
          regions.forEach(r => {
            r.style.fill = '';
          });
          
          // Highlight selected region
          region.style.fill = '#ffcc66';
        });
      });
    }
  });

  // Example 19: Data Table Modal
  document.getElementById('example19')?.addEventListener('click', () => {
    // Sample data for the table
    const users = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', status: 'Inactive' },
      { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'User', status: 'Active' },
      { id: 5, name: 'Edward Stark', email: 'edward@example.com', role: 'Admin', status: 'Active' },
      { id: 6, name: 'Fiona Apple', email: 'fiona@example.com', role: 'User', status: 'Inactive' },
      { id: 7, name: 'George Lucas', email: 'george@example.com', role: 'Editor', status: 'Active' },
      { id: 8, name: 'Hannah Montana', email: 'hannah@example.com', role: 'User', status: 'Active' }
    ];
    
    // Create the table modal
    const tableModal = modalManager.open({
      title: 'User Data Table',
      body: `
        <div class="p-3">
          <div class="mb-3 d-flex justify-content-between align-items-center">
            <div class="input-group" style="max-width: 300px;">
              <input type="text" id="tableSearch" class="form-control" placeholder="Search users...">
              <button class="btn btn-outline-secondary" type="button" id="searchButton">
                <i class="bi bi-search"></i>
              </button>
            </div>
            <div class="dropdown">
              <button class="btn btn-outline-primary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown">
                <i class="bi bi-filter"></i> Filter
              </button>
              <ul class="dropdown-menu" aria-labelledby="filterDropdown">
                <li><a class="dropdown-item filter-option" data-filter="all" href="#">All Users</a></li>
                <li><a class="dropdown-item filter-option" data-filter="Admin" href="#">Admins</a></li>
                <li><a class="dropdown-item filter-option" data-filter="User" href="#">Users</a></li>
                <li><a class="dropdown-item filter-option" data-filter="Editor" href="#">Editors</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item filter-option" data-filter="Active" href="#">Active</a></li>
                <li><a class="dropdown-item filter-option" data-filter="Inactive" href="#">Inactive</a></li>
              </ul>
            </div>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover" id="userTable">
              <thead>
                <tr>
                  <th scope="col" class="sortable" data-sort="id">#</th>
                  <th scope="col" class="sortable" data-sort="name">Name</th>
                  <th scope="col" class="sortable" data-sort="email">Email</th>
                  <th scope="col" class="sortable" data-sort="role">Role</th>
                  <th scope="col" class="sortable" data-sort="status">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(user => `
                  <tr data-role="${user.role}" data-status="${user.status}">
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                      <span class="badge rounded-pill bg-${user.role === 'Admin' ? 'danger' : (user.role === 'Editor' ? 'warning' : 'info')}">
                        ${user.role}
                      </span>
                    </td>
                    <td>
                      <span class="badge rounded-pill ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}">
                        ${user.status}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-secondary view-user" data-id="${user.id}">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-primary edit-user" data-id="${user.id}">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <style>
            .sortable { cursor: pointer; }
            .sortable:hover { background-color: rgba(0,0,0,0.05); }
            .sortable::after { content: "⇵"; margin-left: 5px; opacity: 0.5; }
            .sortable.sort-asc::after { content: "↑"; opacity: 1; }
            .sortable.sort-desc::after { content: "↓"; opacity: 1; }
          </style>
        </div>
      `,
      size: 'xl',
      footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
    });
    
    if (tableModal && tableModal.rootEl) {
      // Implement search functionality
      const searchInput = tableModal.rootEl.querySelector('#tableSearch');
      const searchButton = tableModal.rootEl.querySelector('#searchButton');
      const table = tableModal.rootEl.querySelector('#userTable');
      const filterOptions = tableModal.rootEl.querySelectorAll('.filter-option');
      const sortableHeaders = tableModal.rootEl.querySelectorAll('.sortable');
      
      // Search function
      const searchTable = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      };
      
      if (searchInput) {
        searchInput.addEventListener('keyup', searchTable);
      }
      
      if (searchButton) {
        searchButton.addEventListener('click', searchTable);
      }
      
      // Filter functionality
      filterOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          const filter = option.getAttribute('data-filter');
          const rows = table.querySelectorAll('tbody tr');
          
          rows.forEach(row => {
            if (filter === 'all') {
              row.style.display = '';
            } else if (row.getAttribute('data-role') === filter || row.getAttribute('data-status') === filter) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          });
          
          // Update dropdown button text
          const dropdown = tableModal.rootEl.querySelector('#filterDropdown');
          dropdown.innerHTML = `<i class="bi bi-filter"></i> ${filter === 'all' ? 'Filter' : filter}`;
        });
      });
      
      // Sorting functionality
      sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const sortBy = header.getAttribute('data-sort');
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const isAscending = header.classList.contains('sort-asc');
          
          // Remove sorting classes from all headers
          sortableHeaders.forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
          });
          
          // Add sorting class to current header
          header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
          
          // Determine column index
          const headerIndex = Array.from(header.parentNode.children).indexOf(header);
          
          // Sort rows
          rows.sort((a, b) => {
            const aValue = a.cells[headerIndex].textContent;
            const bValue = b.cells[headerIndex].textContent;
            
            if (!isNaN(aValue) && !isNaN(bValue)) {
              return isAscending ? bValue - aValue : aValue - bValue;
            } else {
              return isAscending ? 
                bValue.localeCompare(aValue) : 
                aValue.localeCompare(bValue);
            }
          });
          
          // Remove existing rows
          rows.forEach(row => row.remove());
          
          // Append sorted rows
          rows.forEach(row => tbody.appendChild(row));
        });
      });
      
      // View/Edit user handlers
      const viewButtons = tableModal.rootEl.querySelectorAll('.view-user');
      const editButtons = tableModal.rootEl.querySelectorAll('.edit-user');
      
      viewButtons.forEach(button => {
        button.addEventListener('click', () => {
          const userId = button.getAttribute('data-id');
          const user = users.find(u => u.id === parseInt(userId));
          
          if (user) {
            modalManager.open({
              title: 'User Details',
              body: `
                <div class="p-4">
                  <div class="text-center mb-4">
                    <div class="bg-light rounded-circle d-inline-flex p-3 mb-3">
                      <i class="bi bi-person-circle" style="font-size: 4rem;"></i>
                    </div>
                    <h4>${user.name}</h4>
                    <p class="text-muted">${user.email}</p>
                  </div>
                  
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Account Information</h5>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between">
                          <span>User ID:</span>
                          <span class="text-muted">#${user.id}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Role:</span>
                          <span class="badge rounded-pill bg-${user.role === 'Admin' ? 'danger' : (user.role === 'Editor' ? 'warning' : 'info')}">${user.role}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Status:</span>
                          <span class="badge rounded-pill ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}">${user.status}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Joined:</span>
                          <span class="text-muted">Jan 15, 2023</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Last Login:</span>
                          <span class="text-muted">Today, 10:42 AM</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              `,
              size: 'md',
              footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
            });
          }
        });
      });
      
      editButtons.forEach(button => {
        button.addEventListener('click', () => {
          const userId = button.getAttribute('data-id');
          const user = users.find(u => u.id === parseInt(userId));
          
          if (user) {
            modalManager.open({
              title: 'Edit User',
              body: `
                <div class="p-3">
                  <form id="editUserForm">
                    <div class="mb-3">
                      <label for="editName" class="form-label">Name</label>
                      <input type="text" class="form-control" id="editName" value="${user.name}">
                    </div>
                    <div class="mb-3">
                      <label for="editEmail" class="form-label">Email</label>
                      <input type="email" class="form-control" id="editEmail" value="${user.email}">
                    </div>
                    <div class="mb-3">
                      <label for="editRole" class="form-label">Role</label>
                      <select class="form-select" id="editRole">
                        <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        <option value="Editor" ${user.role === 'Editor' ? 'selected' : ''}>Editor</option>
                        <option value="User" ${user.role === 'User' ? 'selected' : ''}>User</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label for="editStatus" class="form-label">Status</label>
                      <select class="form-select" id="editStatus">
                        <option value="Active" ${user.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Inactive" ${user.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                      </select>
                    </div>
                  </form>
                </div>
              `,
              size: 'md',
              submitForm: true,
              submitFormButtonText: 'Save Changes',
              footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>'
            });
          }
        });
      });
    }
  });

  // Example 20: Custom Theme Modal
  document.getElementById('example20')?.addEventListener('click', () => {
    const themes = [
      { name: 'Default', class: '', colors: { primary: '#0d6efd', secondary: '#6c757d', background: '#ffffff' } },
      { name: 'Dark', class: 'dark-mode-modal', colors: { primary: '#375a7f', secondary: '#444444', background: '#222222' } },
      { name: 'Gradient', class: 'custom-theme-modal', colors: { primary: '#667eea', secondary: '#764ba2', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' } },
      { name: 'Success', class: 'success-theme', colors: { primary: '#28a745', secondary: '#5a8f69', background: '#f0f9f0' } },
      { name: 'Danger', class: 'danger-theme', colors: { primary: '#dc3545', secondary: '#c16a73', background: '#fff5f5' } }
    ];
    
    const themeModal = modalManager.open({
      title: 'Theme Selector',
      body: `
        <div class="p-3">
          <h5>Choose a Theme</h5>
          <p>Click on a theme card to preview how it looks:</p>
          
          <div class="row mt-4">
            ${themes.map((theme, index) => `
              <div class="col-md-4 mb-3">
                <div class="card theme-card h-100" data-theme="${theme.class}" data-index="${index}">
                  <div class="card-body">
                    <h5 class="card-title">${theme.name}</h5>
                    <div class="d-flex justify-content-between mt-3">
                      <div class="color-swatch" style="background-color: ${theme.colors.primary}"></div>
                      <div class="color-swatch" style="background-color: ${theme.colors.secondary}"></div>
                      <div class="color-swatch" style="background: ${theme.colors.background}"></div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <style>
            .theme-card { 
              cursor: pointer; 
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .theme-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .theme-card.active {
              border: 2px solid #0d6efd;
            }
            .color-swatch {
              width: 25px;
              height: 25px;
              border-radius: 50%;
              border: 1px solid #dee2e6;
            }
            
            /* Custom theme styles for preview */
            .success-theme {
              background-color: #f0f9f0;
              color: #285e28;
            }
            .success-theme .modal-header {
              background-color: #28a745;
              color: white;
              border-bottom: none;
            }
            .success-theme .modal-footer {
              background-color: rgba(40, 167, 69, 0.05);
              border-top: none;
            }
            
            .danger-theme {
              background-color: #fff5f5;
              color: #7d2a2a;
            }
            .danger-theme .modal-header {
              background-color: #dc3545;
              color: white;
              border-bottom: none;
            }
            .danger-theme .modal-footer {
              background-color: rgba(220, 53,, 69, 0.05);
              border-top: none;
            }
          </style>
        </div>
      `,
      size: 'lg',
      footer: `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="applyTheme" class="btn btn-primary">Apply Theme</button>
      `
    });
    
    if (themeModal && themeModal.rootEl) {
      let selectedThemeIndex = 0; // Default theme
      
      // Add click handlers for theme cards
      const themeCards = themeModal.rootEl.querySelectorAll('.theme-card');
      
      themeCards.forEach(card => {
        card.addEventListener('click', () => {
          // Remove active class from all cards
          themeCards.forEach(c => c.classList.remove('active'));
          
          // Add active class to clicked card
          card.classList.add('active');
          
          // Store selected theme index
          selectedThemeIndex = parseInt(card.getAttribute('data-index'));
          
          // Preview theme by applying to modal content
          const modalContent = themeModal.rootEl.querySelector('.modal-content');
          
          // Remove all theme classes
          themes.forEach(theme => {
            if (theme.class) {
              modalContent.classList.remove(theme.class);
            }
          });
          
          // Add selected theme class if not default
          const themeClass = card.getAttribute('data-theme');
          if (themeClass) {
            modalContent.classList.add(themeClass);
          }
        });
      });
      
      // Make the first theme active by default
      themeCards[0].classList.add('active');
      
      // Add handler for apply button
      const applyButton = themeModal.rootEl.querySelector('#applyTheme');
      
      if (applyButton) {
        applyButton.addEventListener('click', () => {
          // Open a new modal with the selected theme
          const selectedTheme = themes[selectedThemeIndex];
          
          const newModal = modalManager.open({
            title: `${selectedTheme.name} Theme Applied`,
            body: `
              <div class="p-4">
                <h5>Theme Applied Successfully</h5>
                <p>You are now viewing a modal with the ${selectedTheme.name} theme applied.</p>
                <div class="alert alert-info mt-3">
                  <i class="bi bi-info-circle me-2"></i> In a real application, this would save your theme preference for all future modals.
                </div>
                
                <div class="mt-4">
                  <h6>Theme Colors:</h6>
                  <div class="d-flex gap-3 mt-2">
                    <div>
                      <div class="color-swatch" style="background-color: ${selectedTheme.colors.primary}"></div>
                      <div class="mt-1 small text-center">Primary</div>
                    </div>
                    <div>
                      <div class="color-swatch" style="background-color: ${selectedTheme.colors.secondary}"></div>
                      <div class="mt-1 small text-center">Secondary</div>
                    </div>
                    <div>
                      <div class="color-swatch" style="background: ${selectedTheme.colors.background}"></div>
                      <div class="mt-1 small text-center">Background</div>
                    </div>
                  </div>
                </div>
              </div>
            `,
            size: 'md',
            footer: '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>'
          });
          
          if (newModal && newModal.rootEl) {
            const newModalContent = newModal.rootEl.querySelector('.modal-content');
            
            // Add theme class if not default
            if (selectedTheme.class) {
              newModalContent.classList.add(selectedTheme.class);
            }
          }
          
          // Close the theme selector modal
          modalManager.close(themeModal);
        });
      }
    }
  });

  // Example 21: Calendar Picker
  document.getElementById('example21')?.addEventListener('click', () => {
    const months = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'
    ];

    let currentDate = new Date();
    let selectedDate = null;

    const generateCalendar = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      
      // First day of the month
      const firstDay = new Date(year, month, 1);
      
      // Last day of the month
      const lastDay = new Date(year, month + 1, 0);
      
      // Starting day of the week (0-6)
      const startingDay = firstDay.getDay();
      
      let calendarHtml = `
        <div class="calendar-container">
          <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
            <button id="prevMonth" class="btn btn-link">&lt;</button>
            <h5 class="mb-0">${months[month]} ${year}</h5>
            <button id="nextMonth" class="btn btn-link">&gt;</button>
          </div>
          <table class="table table-bordered text-center">
            <thead>
              <tr>
                <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
              </tr>
            </thead>
            <tbody>
      `;

      let date_counter = 1;
      let nextMonthCounter = 1;

      // Create calendar grid
      for (let i = 0; i < 6; i++) {
        calendarHtml += '<tr>';
        
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < startingDay) {
            // Previous month's days (empty cells)
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            const prevMonthDay = prevMonthLastDay - (startingDay - j) + 1;
            calendarHtml += `<td class="text-muted bg-light">${prevMonthDay}</td>`;
          } else if (date_counter > lastDay.getDate()) {
            // Next month's days
            calendarHtml += `<td class="text-muted bg-light">${nextMonthCounter}</td>`;
            nextMonthCounter++;
          } else {
            // Current month's days
            const currentFullDate = new Date(year, month, date_counter);
            const isToday = currentFullDate.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && 
              currentFullDate.toDateString() === selectedDate.toDateString();
            
            const dateClass = [
              'calendar-day',
              isToday ? 'today' : '',
              isSelected ? 'selected' : ''
            ].filter(Boolean).join(' ');

            calendarHtml += `
              <td class="${dateClass}" 
                  data-date="${date_counter}" 
                  data-month="${month}" 
                  data-year="${year}">
                ${date_counter}
              </td>
            `;
            date_counter++;
          }
        }
        calendarHtml += '</tr>';
        
        // Stop if we've filled all days
        if (date_counter > lastDay.getDate() && nextMonthCounter > 7) break;
      }

      calendarHtml += `
            </tbody>
          </table>
          <div class="selected-date-display mt-3 text-center">
            <strong>Selected Date:</strong> 
            <span id="selectedDateDisplay">
              ${selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
            </span>
          </div>
        </div>
        <style>
          .calendar-day { cursor: pointer; }
          .calendar-day:hover { background-color: #f0f0f0; }
          .today { 
            background-color: #007bff;
            color: white;
            font-weight: bold;
          }
          .selected { 
            background-color: #28a745;
            color: white;
            font-weight: bold;
          }
        </style>
      `;

      return calendarHtml;
    };

    const calendarModal = modalManager.open({
      title: 'Select a Date',
      body: generateCalendar(currentDate),
      size: 'md',
      footer: `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="confirmDate" class="btn btn-primary" disabled>Confirm</button>
      `
    });

    if (calendarModal && calendarModal.rootEl) {
      const modalBody = calendarModal.rootEl.querySelector('.modal-body');
      const confirmBtn = calendarModal.rootEl.querySelector('#confirmDate');
      
      // Month navigation
      modalBody.addEventListener('click', (e) => {
        if (e.target.id === 'prevMonth') {
          currentDate.setMonth(currentDate.getMonth() - 1);
          modalBody.innerHTML = generateCalendar(currentDate);
          attachDateClickListeners();
        } else if (e.target.id === 'nextMonth') {
          currentDate.setMonth(currentDate.getMonth() + 1);
          modalBody.innerHTML = generateCalendar(currentDate);
          attachDateClickListeners();
        }
      });

      function attachDateClickListeners() {
        const dayElements = modalBody.querySelectorAll('.calendar-day');
        dayElements.forEach(el => {
          el.addEventListener('click', () => {
            // Remove previous selection
            const prevSelected = modalBody.querySelector('.selected');
            if (prevSelected) prevSelected.classList.remove('selected');
            
            // Add new selection
            el.classList.add('selected');
            
            // Update selected date
            const day = parseInt(el.getAttribute('data-date'));
            const month = parseInt(el.getAttribute('data-month'));
            const year = parseInt(el.getAttribute('data-year'));
            
            selectedDate = new Date(year, month, day);
            
            // Update display
            const selectedDateDisplay = modalBody.querySelector('#selectedDateDisplay');
            if (selectedDateDisplay) {
              selectedDateDisplay.textContent = selectedDate.toLocaleDateString();
            }
            
            // Enable confirm button
            if (confirmBtn) {
              confirmBtn.disabled = false;
            }
          });
        });
      }

      // Initial attachment of listeners
      attachDateClickListeners();

      // Confirm button handler
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          if (selectedDate) {
            const displayDate = selectedDate.toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            modalManager.open({
              title: 'Selected Date',
              body: `<div class="p-4 text-center">
                <h4>You selected:</h4>
                <p class="lead">${displayDate}</p>
              </div>`,
              size: 'sm'
            });
            
            modalManager.close(calendarModal);
          }
        });
      }
    }
  });

  // Example 22: Color Picker
  document.getElementById('example22')?.addEventListener('click', () => {
    const colorGroups = {
      'Basic Colors': [
        '#FF0000', '#00FF00', '#0000FF', 
        '#FFFF00', '#FF00FF', '#00FFFF'
      ],
      'Pastel Colors': [
        '#FFB3BA', '#BAFFC9', '#BAE1FF', 
        '#FFFFBA', '#FFDFBA', '#E0BBE4'
      ],
      'Shades of Blue': [
        '#000080', '#0000FF', '#4169E1', 
        '#1E90FF', '#87CEEB', '#B0E0E6'
      ],
      'Earth Tones': [
        '#8B4513', '#A0522D', '#CD853F', 
        '#DEB887', '#D2691E', '#F4A460'
      ]
    };

    let selectedColor = null;

    const colorPickerModal = modalManager.open({
      title: 'Color Picker',
      body: `
        <div class="color-picker-container p-3">
          <div class="color-groups mb-3">
            ${Object.keys(colorGroups).map(group => `
              <button class="btn btn-outline-secondary me-2 mb-2 color-group-btn" 
                      data-group="${group}">
                ${group}
              </button>
            `).join('')}
          </div>
          
          <div id="colorGrid" class="color-grid d-flex flex-wrap justify-content-center gap-2">
            ${colorGroups['Basic Colors'].map(color => `
              <div 
                class="color-swatch" 
                style="background-color: ${color};" 
                data-color="${color}"
                title="${color}"
              ></div>
            `).join('')}
          </div>
          
          <div class="selected-color-display mt-4 text-center">
            <strong>Selected Color:</strong> 
            <span id="selectedColorDisplay">No color selected</span>
            <div 
              id="colorPreview" 
              class="d-inline-block ms-2" 
              style="width: 30px; height: 30px; border: 1px solid #ddd; vertical-align: middle;"
            ></div>
          </div>
        </div>
        <style>
          .color-swatch {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.2s;
            border: 2px solid transparent;
          }
          .color-swatch:hover {
            transform: scale(1.1);
            border-color: #000;
          }
          .color-swatch.selected {
            transform: scale(1.1);
            box-shadow: 0 0 0 3px rgba(0,0,0,0.5);
          }
        </style>
      `,
      size: 'md',
      footer: `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="confirmColor" class="btn btn-primary" disabled>Select Color</button>
      `
    });

    if (colorPickerModal && colorPickerModal.rootEl) {
      const colorGrid = colorPickerModal.rootEl.querySelector('#colorGrid');
      const colorGroupBtns = colorPickerModal.rootEl.querySelectorAll('.color-group-btn');
      const selectedColorDisplay = colorPickerModal.rootEl.querySelector('#selectedColorDisplay');
      const colorPreview = colorPickerModal.rootEl.querySelector('#colorPreview');
      const confirmBtn = colorPickerModal.rootEl.querySelector('#confirmColor');

      // Color group filtering
      colorGroupBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const group = btn.getAttribute('data-group');
          
          // Update active state of buttons
          colorGroupBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Update color grid
          colorGrid.innerHTML = colorGroups[group].map(color => `
            <div 
              class="color-swatch ${color === selectedColor ? 'selected' : ''}" 
              style="background-color: ${color};" 
              data-color="${color}"
              title="${color}"
            ></div>
          `).join('');

          // Reattach color selection listeners
          attachColorSwatchListeners();
        });
      });

      // Color swatch selection
      function attachColorSwatchListeners() {
        const colorSwatches = colorGrid.querySelectorAll('.color-swatch');
        
        colorSwatches.forEach(swatch => {
          swatch.addEventListener('click', () => {
            // Remove previous selection
            const prevSelected = colorGrid.querySelector('.selected');
            if (prevSelected) prevSelected.classList.remove('selected');
            
            // Add new selection
            swatch.classList.add('selected');
            
            // Update selected color
            selectedColor = swatch.getAttribute('data-color');
            
            // Update display
            selectedColorDisplay.textContent = selectedColor;
            colorPreview.style.backgroundColor = selectedColor;
            
            // Enable confirm button
            if (confirmBtn) {
              confirmBtn.disabled = false;
            }
          });
        });
      }

      // Initial attachment of listeners
      attachColorSwatchListeners();

      // Confirm button handler
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          if (selectedColor) {
            modalManager.open({
              title: 'Selected Color',
              body: `
                <div class="p-4 text-center">
                  <h4>You selected:</h4>
                  <div class="my-4" style="
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background-color: ${selectedColor};
                    margin: 0 auto;
                    border: 1px solid #ddd;
                  "></div>
                  <p class="lead">${selectedColor}</p>
                </div>
              `,
              size: 'sm'
            });
            
            modalManager.close(colorPickerModal);
          }
        });
      }
    }
  });
});