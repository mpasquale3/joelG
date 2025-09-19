// Quiz functionality for JG Fit Coach website

// Quiz state management
const QuizManager = {
    currentQuestion: 0,
    answers: [],
    lifestyleScore: 0,
    bodybuildingScore: 0,
    isActive: false,
    
    // Quiz questions with scoring
    questions: [
        {
            question: "What's your primary fitness goal?",
            options: [
                { text: "Improve general health and wellness", lifestyle: 3, bodybuilding: 0 },
                { text: "Build muscle and physique", lifestyle: 1, bodybuilding: 2 },
                { text: "Compete in bodybuilding", lifestyle: 0, bodybuilding: 3 },
                { text: "Get personalized training", lifestyle: 2, bodybuilding: 1 }
            ]
        },
        {
            question: "What's your current fitness experience?",
            options: [
                { text: "Complete beginner", lifestyle: 2, bodybuilding: 0 },
                { text: "Some experience (6 months - 2 years)", lifestyle: 2, bodybuilding: 1 },
                { text: "Experienced (2+ years)", lifestyle: 1, bodybuilding: 2 },
                { text: "Competitive athlete", lifestyle: 0, bodybuilding: 3 }
            ]
        },
        {
            question: "What type of coaching do you prefer?",
            options: [
                { text: "Online/Virtual coaching", lifestyle: 2, bodybuilding: 2 },
                { text: "In-person training", lifestyle: 2, bodybuilding: 1 },
                { text: "Specialized posing coaching", lifestyle: 0, bodybuilding: 3 },
                { text: "Flexible - either works", lifestyle: 1, bodybuilding: 1 }
            ]
        },
        {
            question: "What motivates you most?",
            options: [
                { text: "Long-term health and longevity", lifestyle: 3, bodybuilding: 0 },
                { text: "Building an impressive physique", lifestyle: 1, bodybuilding: 2 },
                { text: "Competing and stage presence", lifestyle: 0, bodybuilding: 3 },
                { text: "Personal achievement and confidence", lifestyle: 2, bodybuilding: 1 }
            ]
        }
    ],

    // Initialize quiz
    init() {
        this.attachEventListeners();
        console.log('Quiz manager initialized');
    },

    // Attach event listeners
    attachEventListeners() {
        // Start quiz buttons
        const startButtons = document.querySelectorAll('[onclick*="startQuiz"]');
        startButtons.forEach(button => {
            button.removeAttribute('onclick');
            button.addEventListener('click', () => this.start());
        });

        // Modal close button
        const closeButton = document.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }

        // Click outside modal to close
        const modal = document.getElementById('quiz-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close();
                }
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.close();
            }
        });
    },

    // Start the quiz
    start() {
        this.reset();
        this.isActive = true;
        this.showModal();
        this.displayQuestion();
        this.trackEvent('quiz_started');
    },

    // Reset quiz state
    reset() {
        this.currentQuestion = 0;
        this.answers = [];
        this.lifestyleScore = 0;
        this.bodybuildingScore = 0;
    },

    // Show the quiz modal
    showModal() {
        const modal = document.getElementById('quiz-modal');
        const content = document.getElementById('quiz-content');
        const result = document.getElementById('quiz-result');
        
        if (modal && content && result) {
            modal.classList.remove('hidden');
            content.classList.remove('hidden');
            result.classList.add('hidden');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            modal.setAttribute('aria-hidden', 'false');
            const firstFocusable = modal.querySelector('button, [tabindex="0"]');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    },

    // Hide the quiz modal
    hideModal() {
        const modal = document.getElementById('quiz-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            modal.setAttribute('aria-hidden', 'true');
        }
    },

    // Close quiz
    close() {
        this.hideModal();
        this.isActive = false;
        this.trackEvent('quiz_closed', {
            question_number: this.currentQuestion,
            completed: this.currentQuestion >= this.questions.length
        });
    },

    // Display current question
    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) return;

        // Update progress
        this.updateProgress();
        
        // Update question text
        const questionElement = document.getElementById('quiz-question');
        if (questionElement) {
            questionElement.textContent = question.question;
        }

        // Update options
        this.renderOptions(question.options);

        // Update progress text
        const progressElement = document.getElementById('quiz-progress');
        if (progressElement) {
            progressElement.textContent = `${this.currentQuestion + 1} of ${this.questions.length}`;
        }
    },

    // Render answer options
    renderOptions(options) {
        const optionsContainer = document.getElementById('quiz-options');
        if (!optionsContainer) return;

        optionsContainer.innerHTML = '';

        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option.text;
            button.setAttribute('data-index', index);
            
            // Add keyboard navigation
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectAnswer(index);
                }
            });
            
            button.addEventListener('click', () => this.selectAnswer(index));
            
            optionsContainer.appendChild(button);
        });

        // Focus first option for keyboard navigation
        const firstOption = optionsContainer.querySelector('.quiz-option');
        if (firstOption) {
            firstOption.focus();
        }
    },

    // Update progress bar
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const percentage = ((this.currentQuestion + 1) / this.questions.length) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    },

    // Handle answer selection
    selectAnswer(optionIndex) {
        const question = this.questions[this.currentQuestion];
        const selectedOption = question.options[optionIndex];
        
        // Store answer
        this.answers.push({
            questionIndex: this.currentQuestion,
            optionIndex: optionIndex,
            option: selectedOption
        });

        // Update scores
        this.lifestyleScore += selectedOption.lifestyle;
        this.bodybuildingScore += selectedOption.bodybuilding;

        // Track answer selection
        this.trackEvent('quiz_answer_selected', {
            question_number: this.currentQuestion + 1,
            answer_text: selectedOption.text,
            lifestyle_score: selectedOption.lifestyle,
            bodybuilding_score: selectedOption.bodybuilding
        });

        // Add visual feedback
        this.showAnswerFeedback(optionIndex);

        // Move to next question or show results
        setTimeout(() => {
            this.currentQuestion++;
            
            if (this.currentQuestion < this.questions.length) {
                this.displayQuestion();
            } else {
                this.showResults();
            }
        }, 300);
    },

    // Show visual feedback for selected answer
    showAnswerFeedback(selectedIndex) {
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            if (index === selectedIndex) {
                option.style.background = '#F0FDF9';
                option.style.borderColor = '#5FEFA7';
                option.style.transform = 'scale(0.98)';
            } else {
                option.style.opacity = '0.5';
            }
        });
    },

    // Calculate and show results
    showResults() {
        const isLifestyle = this.lifestyleScore > this.bodybuildingScore;
        const resultType = isLifestyle ? 'lifestyle' : 'bodybuilding';
        
        // Hide question content, show results
        const content = document.getElementById('quiz-content');
        const result = document.getElementById('quiz-result');
        
        if (content && result) {
            content.classList.add('hidden');
            result.classList.remove('hidden');
        }

        // Update result content
        this.updateResultDisplay(resultType, isLifestyle);

        // Track completion
        this.trackEvent('quiz_completed', {
            result_type: resultType,
            lifestyle_score: this.lifestyleScore,
            bodybuilding_score: this.bodybuildingScore,
            total_questions: this.questions.length
        });
    },

    // Update result display
    updateResultDisplay(resultType, isLifestyle) {
        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultDescription = document.getElementById('result-description');
        const viewServicesBtn = document.getElementById('view-services');

        if (resultIcon) {
            resultIcon.style.background = isLifestyle ? '#5FEFA7' : '#E6AA36';
            resultIcon.textContent = isLifestyle ? '👤' : '🏋️';
        }

        if (resultTitle) {
            resultTitle.textContent = isLifestyle ? 'Lifestyle Fitness' : 'Bodybuilding Focus';
        }

        if (resultDescription) {
            resultDescription.textContent = isLifestyle 
                ? 'Based on your answers, our lifestyle fitness programs would be perfect for you!'
                : 'Based on your answers, our bodybuilding and specialized training programs align with your goals!';
        }

        if (viewServicesBtn) {
            viewServicesBtn.style.background = isLifestyle ? '#5FEFA7' : '#E6AA36';
            viewServicesBtn.style.color = '#030303';
            
            // Update the click handler based on current page
            viewServicesBtn.onclick = () => {
                this.handleViewServices(resultType);
            };
        }

        // Update consultation button color
        const consultBtn = result.querySelector('.cta-button[style*="border"]');
        if (consultBtn) {
            const color = isLifestyle ? '#5FEFA7' : '#E6AA36';
            consultBtn.style.borderColor = color;
            consultBtn.style.color = color;
        }
    },

    // Handle view services based on current page
    handleViewServices(resultType) {
        this.close();
        
        if (window.location.pathname.includes('services')) {
            // If on services page, filter services
            if (typeof filterServices === 'function') {
                filterServices(resultType);
            }
        } else {
            // Navigate to services page with filter
            window.location.href = `services.html?filter=${resultType}`;
        }

        this.trackEvent('quiz_view_services_clicked', { result_type: resultType });
    },

    // Handle consultation booking
    handleConsultationBooking() {
        this.close();
        window.location.href = 'contact.html';
        this.trackEvent('quiz_consultation_clicked');
    },

    // Analytics tracking (replace with your preferred analytics service)
    trackEvent(eventName, properties = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_map: properties
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, properties);
        }
        
        // Console logging for development
        console.log('Quiz Event:', eventName, properties);
    },

    // Get quiz statistics
    getStats() {
        return {
            currentQuestion: this.currentQuestion,
            totalQuestions: this.questions.length,
            progress: (this.currentQuestion / this.questions.length) * 100,
            lifestyleScore: this.lifestyleScore,
            bodybuildingScore: this.bodybuildingScore,
            answers: [...this.answers]
        };
    },

    // Resume quiz from specific question (for interrupted sessions)
    resumeFrom(questionIndex, previousAnswers = []) {
        if (questionIndex >= 0 && questionIndex < this.questions.length) {
            this.currentQuestion = questionIndex;
            this.answers = [...previousAnswers];
            
            // Recalculate scores
            this.lifestyleScore = 0;
            this.bodybuildingScore = 0;
            this.answers.forEach(answer => {
                this.lifestyleScore += answer.option.lifestyle;
                this.bodybuildingScore += answer.option.bodybuilding;
            });
            
            this.showModal();
            this.displayQuestion();
        }
    }
};

// Global functions for backward compatibility
function startQuiz() {
    QuizManager.start();
}

function closeQuiz() {
    QuizManager.close();
}

function answerQuestion(optionIndex) {
    QuizManager.selectAnswer(optionIndex);
}

// Check URL parameters for auto-filtering services
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    
    if (filter && typeof filterServices === 'function') {
        // Small delay to ensure page is loaded
        setTimeout(() => {
            filterServices(filter);
        }, 100);
    }
}

// Quiz persistence (optional - saves quiz state to localStorage)
const QuizPersistence = {
    key: 'jgfit_quiz_state',
    
    save(quizState) {
        try {
            localStorage.setItem(this.key, JSON.stringify(quizState));
        } catch (e) {
            console.warn('Could not save quiz state:', e);
        }
    },
    
    load() {
        try {
            const saved = localStorage.getItem(this.key);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.warn('Could not load quiz state:', e);
            return null;
        }
    },
    
    clear() {
        try {
            localStorage.removeItem(this.key);
        } catch (e) {
            console.warn('Could not clear quiz state:', e);
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    QuizManager.init();
    checkURLParams();
    
    // Load any saved quiz state (optional feature)
    const savedState = QuizPersistence.load();
    if (savedState && savedState.currentQuestion > 0 && savedState.currentQuestion < QuizManager.questions.length) {
        // Optional: Show resume dialog
        console.log('Previous quiz session found');
    }
});

// Save quiz state before page unload (optional)
window.addEventListener('beforeunload', function() {
    if (QuizManager.isActive) {
        QuizPersistence.save(QuizManager.getStats());
    }
});

// Export for use in other scripts
window.QuizManager = QuizManager;