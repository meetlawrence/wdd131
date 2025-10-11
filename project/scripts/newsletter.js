// Key for localStorage
const SUB_STATUS_KEY = 'dreamNigeriaSubscriptionStatus';
const newsletterSection = document.querySelector('.newsletter-section');

/**
 * Hides the form and displays a message indicating the user is already subscribed.
 */
function displayAlreadySubscribedMessage() {
    if (newsletterSection) {
        newsletterSection.innerHTML = `
            <h2>Subscription Status</h2>
            <p>You are already subscribed to the Dream Nigeria Community! We've saved your spot—check your inbox for the latest updates.</p>
        `;
        // Ensure the section is fully visible if it was potentially hidden by other CSS
        newsletterSection.style.display = 'block'; 
    }
}

/**
 * Handles the newsletter form submission,
 * and displays a success message to the user.
 */
function handleNewsletterSubmission(event) {
    // 1. Prevent the default form submission action (which would reload the page)
    event.preventDefault();

    // LOCALSTORAGE LOGIC: PRE-CHECK*
    if (localStorage.getItem(SUB_STATUS_KEY) === 'true') {
        displayAlreadySubscribedMessage();
        return; 
    }
    // Get the form and the elements needed for feedback
    const form = event.target;
    const emailInput = document.getElementById('subscribe-email');
    
    // Checks if field is not empty
    if (!emailInput.value.trim()) {
        alert('Please enter a valid email address.');
        return;
    }

    // 2. Hide the form elements
    form.style.display = 'none';

    // SAVE SUCCESS STATUS*
    // Mark the user as successfully subscribed in localStorage
    localStorage.setItem(SUB_STATUS_KEY, 'true');

    // 3. Create and inject the success message element
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.style.textAlign = 'center';
    successMessage.style.padding = '2rem';
    successMessage.style.backgroundColor = 'var(--accent-light, #fff)'; 
    successMessage.style.borderRadius = 'var(--radius, 8px)';
    successMessage.style.marginTop = '1.5rem';
    successMessage.style.color = '#000'; 

    const submittedEmail = emailInput.value.trim();

    successMessage.innerHTML = `
        <i class="fa-solid fa-circle-check fa-3x" style="color: var(--accent, #008000);"></i>
        <h3>Subscription Successful!</h3>
        <p>Thank you for joining the Dream Nigeria community! A confirmation email has been sent to <strong>${submittedEmail}</strong>.</p>
        <p>Get ready for exclusive travel tips and updates!</p>
    `;
    
    // Insert the success message right after the introductory paragraph
    const paragraph = newsletterSection.querySelector('p:not(.newsletter-input-group p)');
    if (paragraph) {
        paragraph.insertAdjacentElement('afterend', successMessage);
    } else {
        // Fallback
        newsletterSection.appendChild(successMessage);
    }
}

// 4. Attach the event listener and check initial state
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');

    // Check if the user is already subscribed
    if (localStorage.getItem(SUB_STATUS_KEY) === 'true') {
        displayAlreadySubscribedMessage();
        // Return early to prevent attaching the submit listener to the form
        return; 
    }

    // Only attach the listener if the user is NOT already subscribed
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
});