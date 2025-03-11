document.addEventListener('DOMContentLoaded', function() {
    // Email form and waitlist button functionality
    const emailForm = document.querySelector('.email-form');
    const ctaButton = document.querySelector('.cta-button');
    const emailInput = document.querySelector('.email-input');
    
    // Bottom waitlist form
    const waitlistForm = document.querySelector('.waitlist-form');
    const waitlistButton = document.querySelector('.waitlist-button');
    const waitlistInput = document.querySelector('.waitlist-input');
    
    // Modal elements
    const emailSignupModal = document.getElementById('emailSignupModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalForm = document.querySelector('.modal-form');
    const modalEmailInput = document.querySelector('.modal-email-input');

    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Show modal on page load for mobile devices
    if (isMobile) {
        setTimeout(() => {
            emailSignupModal.classList.add('active');
        }, 2000); // Show after 2 seconds
    }
    
    // Close modal when close button is clicked
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            emailSignupModal.classList.remove('active');
        });
    }
    
    // Handle modal form submission
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = modalEmailInput.value.trim();
            handleWaitlistSignup(email, true);
        });
    }

    if (emailForm && ctaButton) {
        // Handle form submission
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            handleWaitlistSignup(email, false);
        });

        // Handle button click
        ctaButton.addEventListener('click', function() {
            const email = emailInput.value.trim();
            handleWaitlistSignup(email, false);
        });
    }

    // Handle bottom waitlist form submission
    if (waitlistForm && waitlistButton) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = waitlistInput.value.trim();
            handleWaitlistSignup(email, false);
        });
        
        waitlistButton.addEventListener('click', function(e) {
            e.preventDefault();
            const email = waitlistInput.value.trim();
            handleWaitlistSignup(email, false);
        });
    }

    function handleWaitlistSignup(email, isModal) {
        if (email && isValidEmail(email)) {
            // Here you would typically send the email to your backend
            alert('Thank you for joining our waitlist! We will notify you at ' + email);
            
            // Clear input and close modal if from modal
            if (isModal) {
                modalEmailInput.value = '';
                emailSignupModal.classList.remove('active');
            } else {
                // Clear the specific input that was used
                if (email === waitlistInput.value) {
                    waitlistInput.value = '';
                } else {
                    emailInput.value = '';
                }
            }
        } else if (!email) {
            alert('Please enter your email address');
        } else {
            alert('Please enter a valid email address');
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Nav items functionality
    const navItems = document.querySelectorAll('.dashboard-nav li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Handle feature selector buttons
    const selectorButtons = document.querySelectorAll('.selector-btn');
    const dashboardImages = document.querySelectorAll('.dashboard-image');
    const featureDescriptions = document.querySelectorAll('.feature-description');

    selectorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.getAttribute('data-view');
            
            // Update button states
            selectorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update dashboard image
            dashboardImages.forEach(img => {
                if (img.getAttribute('data-view') === view) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });

            // Update feature description
            featureDescriptions.forEach(desc => {
                if (desc.getAttribute('data-view') === view) {
                    desc.classList.add('active');
                } else {
                    desc.classList.remove('active');
                }
            });
        });
    });

    // Rotating text functionality
    function setupRotatingText() {
        const words = document.querySelectorAll('.word-rotate-items em');
        let currentIndex = 0;
        const rotationInterval = 2000; // 2 seconds

        function rotateWord() {
            // Remove active class and add out class to current word
            words[currentIndex].classList.add('out');
            setTimeout(() => {
                words[currentIndex].classList.remove('active', 'out');
                // Move to next word
                currentIndex = (currentIndex + 1) % words.length;
                // Add active class to new word
                words[currentIndex].classList.add('active');
            }, 400); // This should match the animation duration
        }

        // Initialize first word
        words[0].classList.add('active');

        // Start rotation
        setInterval(rotateWord, rotationInterval);
    }

    setupRotatingText();

    // Carousel functionality
    function setupCarousel() {
        const track = document.querySelector('.carousel-track');
        const cards = track.querySelectorAll('.carousel-card');
        
        // Clone cards and append them to create infinite scroll effect
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
    }

    setupCarousel();

    // Scroll animation for image cards on mobile
    function setupScrollAnimations() {
        // Check if device is mobile
        const isMobile = window.innerWidth <= 768;
        
        // Only apply these animations on mobile
        if (isMobile) {
            const imageCardWrappers = document.querySelectorAll('.image-card-wrapper');
            
            // Create IntersectionObserver to detect when cards are in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add visible class when card is in view
                        entry.target.classList.add('in-viewport');
                        
                        // Optionally stop observing after animation is triggered
                        // observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null, // viewport
                threshold: 0.3, // When 30% of the element is visible
                rootMargin: '-50px' // Trigger a bit before the element enters the viewport
            });
            
            // Observe all card wrappers
            imageCardWrappers.forEach(card => {
                observer.observe(card);
            });
        } else {
            // For desktop, make sure we don't add unnecessary classes
            document.querySelectorAll('.image-card-wrapper').forEach(card => {
                card.classList.remove('in-viewport');
            });
        }
        
        // Handle resize events to reapply/remove based on screen size
        window.addEventListener('resize', debounce(() => {
            setupScrollAnimations();
        }, 250));
    }
    
    // Helper debounce function for the resize event
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
    
    // Initialize scroll animations
    setupScrollAnimations();
});
