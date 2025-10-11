document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const summaryDetails = document.getElementById('summary-details');

    // Object to hold data for display
    const data = {};

    // Helper function to capitalize the first letter of a string
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // Function to convert form names to readable labels
    function getLabel(key) {
        switch (key) {
            case 'fullName':
               return 'Full Name';
            case 'email':
                return 'Email Address';
            case 'phone':
                return 'Phone Number';
            case 'travelDate':
                return 'Travel Month/Year';
            case 'destinationInterest':
                return 'Areas of Interest';
            case 'numTravelers':
                return 'Number of Travelers';
            case 'message':
                return 'Your Message';
            default:
                // Tries to convert camelCase to Title Case (e.g., 'firstName' -> 'First Name')
                return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        }
    }

    // Function to convert select option values to readable text
    function getOptionText(value) {
        switch (value) {
            case 'lagos-ph':
                return 'Lagos & Coastal Cities';
            case 'abuja-north':
                return 'Abuja & Northern History';
            case 'culture':
                return 'Deep Cultural Immersion';
            case 'nature':
                return 'Nature & Wildlife (Parks)';
            case 'flexible':
                return 'Flexible / Undecided';
            default:
                return capitalize(value);
        }
    }


    // Iterate over all query parameters
    for (const [key, value] of params.entries()) {
        if (value) { // Only store non-empty values
            let displayValue = value;
            
            if (key === 'destinationInterest') {
                displayValue = getOptionText(value);
            } else if (key === 'travelDate') {
                // Reformat YYYY-MM to Month YYYY
                const [year, month] = value.split('-');
                if (month && year) {
                    const date = new Date(year, month - 1);
                    const options = { year: 'numeric', month: 'long' };
                    displayValue = date.toLocaleDateString('en-US', options);
                }
            }
            
            data[getLabel(key)] = displayValue;
        }
    }

    // Check if any data was found
    if (Object.keys(data).length > 0) {
        // Clear the "Loading" message
        summaryDetails.innerHTML = ''; 

        // Build the HTML list for the summary
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';

        for (const [label, value] of Object.entries(data)) {
            const li = document.createElement('li');
            li.style.marginBottom = '10px';
            li.innerHTML = `<strong>${label}:</strong> ${value}`;
            ul.appendChild(li);
        }

        summaryDetails.appendChild(ul);
    } else {
        // Handle case where no form data was passed
        summaryDetails.innerHTML = '<p>It looks like you navigated here directly. Please use the <a href="index.html#form-section">Trip Inquiry Form</a> to plan your adventure!</p>';
    }
});