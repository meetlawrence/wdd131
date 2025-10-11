const resourceData = [
    {
        className: "visa",
        icon: "fa-solid fa-passport",
        title: "Visa & Entry Requirements",
        description: "Information on getting a Nigerian visa, health requirements (yellow fever card), and arrival procedures at international airports.",
        linkText: "Check Visa Status",
        linkUrl: "#"
    },
    {
        className: "safety",
        icon: "fa-solid fa-shield-halved",
        title: "Safety & Health Tips",
        description: "Local safety advice, recommended vaccinations, emergency contacts, and travel insurance guidance for peace of mind.",
        linkText: "Read Safety Guide",
        linkUrl: "#"
    },
    {
        className: "accommodation",
        icon: "fa-solid fa-hotel",
        title: "Accommodation Booking",
        description: "Find the best hotels, serviced apartments, and unique local stays in Lagos, Abuja, Port Harcourt, and other major cities.",
        linkText: "Find Stays",
        linkUrl: "#"
    },
    {
        className: "money",
        icon: "fa-solid fa-wallet",
        title: "Money & Budgeting",
        description: "Current exchange rates for the Naira (NGN), advice on withdrawing cash, using credit cards, and typical daily travel costs.",
        linkText: "View Budget Guide",
        linkUrl: "#"
    }
];

const itineraryData = [
    {
        className: "",
        image: "images/img/eko.webp",
        alt: "Eko Atlantic City in Lagos",
        title: "7-Day Coastal Culture Tour (Lagos & Calabar)",
        description: "A fast-paced itinerary focusing on the dynamic arts scene of Lagos, historical sites, and concluding with the relaxed, festival atmosphere of Calabar.",
        points: [
            "Visit the Lekki Conservation Centre.",
            "Explore Calabar's Marina Resort.",
            "Experience Lagos nightlife."
        ],
        linkText: "Download Full Plan",
        linkUrl: "#"
    },
    {
        className: "reverse",
        image: "images/img/palace.webp",
        alt: "Ancient Palace in Northern Nigeria",
        title: "10-Day Northern History Trek (Kano & Abuja)",
        description: "An in-depth journey through Nigeria's north, exploring ancient trade routes, traditional emirate palaces, and the modern capital's landmarks.",
        points: [
            "Tour the Kano Central Mosque and Dye Pits.",
            "Hike around Abuja's Aso Rock.",
            "Visit the National Museum in Abuja."
        ],
        linkText: "Download Full Plan",
        linkUrl: "#"
    }
];

/**
 * Generates the HTML for the resource cards (Visa, Safety, etc.)
 */
function createResourceCard(resource) {
    return `
        <article class="resource-card ${resource.className}">
            <i class="${resource.icon} fa-3x"></i>
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <a href="${resource.linkUrl}" class="resource-link">${resource.linkText}</a>
        </article>
    `;
}

/**
 * Generates the HTML for the itinerary cards.
 */
function createItineraryCard(itinerary) {
    // Generate the <li> elements for the itinerary points
    const pointsHTML = itinerary.points.map(point => `<li>${point}</li>`).join('');

    return `
        <div class="card itinerary-card ${itinerary.className}">
            <div class="card-content">
                <div class="itinerary-image">
                    <img src="${itinerary.image}" alt="${itinerary.alt}" loading="lazy">
                </div>
                <div class="itinerary-text">
                    <h3>${itinerary.title}</h3>
                    <p>${itinerary.description}</p>
                    <ul class="itinerary-points">
                        ${pointsHTML}
                    </ul>
                    <a href="${itinerary.linkUrl}" class="explore-button small-button">${itinerary.linkText}</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Finds the containers and loads all dynamic content.
 */
function loadTripContent() {
    const planningGrid = document.querySelector('.planning-grid');
    const itinerarySection = document.querySelector('.itinerary-section');

    // 1. Load Resource Cards
    if (planningGrid) {
        const resourceCardsHTML = resourceData.map(createResourceCard).join('');
        planningGrid.innerHTML = resourceCardsHTML;
    }

    // 2. Load Itinerary Cards
    if (itinerarySection) {
        // Generate and join all itinerary cards
        const itineraryCardsHTML = itineraryData.map(createItineraryCard).join('');
        
        // Append the new cards directly after the <h2> tag
        // We look for the h2 (first child) and insert the new HTML after it.
        const h2 = itinerarySection.querySelector('h2');
        if (h2) {
             h2.insertAdjacentHTML('afterend', itineraryCardsHTML);
        } else {
            // Fallback: If h2 isn't found, set the innerHTML
            itinerarySection.innerHTML += itineraryCardsHTML;
        }
    }
}

// Run the function when the page content is fully loaded
document.addEventListener('DOMContentLoaded', loadTripContent);