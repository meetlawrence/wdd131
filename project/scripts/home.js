
const destinationPlaces = [
    {
        image: 'images/img/obudu.webp',
        title: 'Obudu Mountain Resort',
        description: 'Experience the breathtaking beauty of Obudu Mountain Resort, a perfect blend of nature and adventure.',
        link: 'obudu.html'
    },
    {
        image: 'images/img/aso-rock.webp',
        title: 'Aso Rock',
        description: 'Discover the iconic Aso Rock, a symbol of Nigeria\'s rich history and culture, located in the heart of Abuja.',
        link: 'aso-rock.html'
    },
    {
        image: 'images/img/drill.webp',
        title: 'Drill Ranch',
        description:'Discover Drill Ranch, a wildlife sanctuary in Cross River State dedicated to protecting endangered drill monkeys and preserving Nigeria’s rainforest heritage.',
        link: 'drill.html'
    },
    { 
        image: 'images/img/lekki.webp',
        title: 'Lekki Conservation Center',
        description: 'Explore the lush greenery and diverse wildlife at Lekki Conservation Center, a haven for nature lovers in Lagos.',
        link: 'lekki-conservation-center.html'
    },
    { 
        image: 'images/img/agbokim.webp',
        title: 'Agbokim Waterfalls',
        description: 'Witness the stunning Agbokim Waterfalls, a series of cascading falls surrounded by tropical rainforest in Cross River State.',
        link: 'agbokim-waterfalls.html'
    }
];

// Key for localStorage
const DESTINATION_INDEX_KEY = 'lastDestinationIndex';

let index = 0;
let rotationInterval;

// -------------------------------------------------------------------
// LOCAL STORAGE LOAD FUNCTION
// -------------------------------------------------------------------

/**
 * Checks localStorage for the last saved destination index and sets the global 'index'.
 */
function loadLastDestinationIndex() {
    const savedIndex = localStorage.getItem(DESTINATION_INDEX_KEY);
    
    if (savedIndex) {
        const parsedIndex = parseInt(savedIndex, 10);
        
        // Use the saved index only if it's a valid number and within array bounds
        if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < destinationPlaces.length) {
            index = parsedIndex;
        } else {
            // If the saved index is invalid (e.g., data corruption or array size changed), reset to 0
            index = 0; 
        }
    }
}

// Function to update the destination
function updateDestination() {
    const destinationImage = document.getElementById('destination-img');
    const destinationHeading = document.getElementById('destination-heading');
    const destinationDescription = document.getElementById('destination-description');

    // Safety check: if the elements aren't found, stop to prevent errors
    if (!destinationImage || !destinationHeading || !destinationDescription) {
        stopRotation(); 
        return;
    }

    const place = destinationPlaces[index];
    destinationImage.src = place.image;
    destinationHeading.textContent = place.title;
    destinationDescription.textContent = place.description;

    // 1. Calculate the index for the *next* slide
    index = (index + 1) % destinationPlaces.length;

    // 2. Save the calculated *next* index to localStorage for persistence
    localStorage.setItem(DESTINATION_INDEX_KEY, index.toString());
}

// Start the rotation
function startRotation() {
    // Ensure any running interval is cleared before starting a new one
    clearInterval(rotationInterval); 
    rotationInterval = setInterval(updateDestination, 3000);
}

// Stop the rotation
function stopRotation() {
    clearInterval(rotationInterval);
}

// Festival Data (remains the same)
const festivalPlaces = [
    {
        title: 'Argungu Fishing Festival',
        description: 'Experience the vibrant Argungu Fishing Festival, a celebration of culture and tradition in Kebbi State.',
        link: 'https://en.wikipedia.org/wiki/Argungu_Fishing_Festival',
        date: 'March 2025',
        city: 'Argungu, Kebbi State'
    },
    {
        title: 'Ojude Oba Festival',
        description: 'Experience the rich culture and spectacular horsemanship in Ijebu-Ode, Ogun State. This vibrant festival celebrates the Awujale of Ijebuland with magnificent parades by various age grades (Regberegbe) and thrilling equestrian displays.',
        link: 'https://en.wikipedia.org/wiki/Ojude_Oba_festival',
        date: '3rd day after Eid al-Kabir',
        city: 'Ijebu-Ode, Ogun State,'
    },
    { 
        title: 'Eyo Festival',
        description: 'Witness the colorful Eyo Festival, a traditional Yoruba festival held in Lagos to honor the departed souls of Lagosians.',
        link: 'https://en.wikipedia.org/wiki/Eyo_festival',
        date: 'May 2025',
        city: 'Lagos, Lagos State'
    }
];

// Function to create and display festival cards
function createFestivalCard(festivals) {
    const festivalContainer = document.querySelector('.festival-cards');

    if (!festivalContainer) {
        console.error('Festival container not found!');
        return;
    }

    const festivalCardsHTML = festivals.map(festival => `
        <div class="festival-card">
            <h3>${festival.title}</h3>
            <p class="description">${festival.description}</p>
            <p class="details"><strong>Date:</strong> ${festival.date}</p>
            <p class="details"><strong>Location:</strong> ${festival.city}</p>
            <a href="${festival.link}" class="explore-button small-button learn-more" target="_blank">Learn More</a>
        </div>
    `).join('');

    festivalContainer.innerHTML = festivalCardsHTML;
}

// -------------------------------------------------------------------
// CONSOLIDATED INITIALIZATION BLOCK
// -------------------------------------------------------------------

// Run all necessary initialization after page structure is loaded
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. Load the last index from localStorage to set the starting point
    loadLastDestinationIndex();
    
    // 2. Destination Slide Initialization
    // The first call uses the 'index' loaded from localStorage
    updateDestination();
    startRotation();
    
    // 3. Pause on hover 
    const destinationCard = document.querySelector('.card:first-of-type'); 

    if (destinationCard) {
        destinationCard.addEventListener('mouseenter', stopRotation);
        destinationCard.addEventListener('mouseleave', startRotation);
    } else {
        console.warn("Could not find destination card for hover listener.");
    }
    
    // 4. Festival Card Generation
    createFestivalCard(festivalPlaces);

    // 5. Menu Toggle Setup
    const menuButton = document.querySelector('#menu');
    const nav = document.querySelector('.navigation');

    if (menuButton && nav) {
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('show');
            nav.classList.toggle('show');
        });
    } else {
        console.warn("Menu button or navigation not found.");
    }
});