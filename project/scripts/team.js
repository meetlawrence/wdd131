const teamData = [
    {
        image: "images/img/profile.webp",
        alt: "Photo of Lawrence Okon",
        name: "Lawrence Okon",
        role: "Founder & Developer",
        bio: "Blending technology and culture to reshape global perceptions of Nigeria through immersive digital storytelling.",
        social: [
            { icon: "fa-brands fa-linkedin-in", link: "https://www.linkedin.com/in/lawrence-okon-53521b1aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app " },
            { icon: "fa-brands fa-instagram", link: "https://instagram.com/itam_okpo" }
        ]
    },
    {
        image: "images/img/ben.webp",
        alt: "Photo of Ben Iwara",
        name: "Ben Iwara",
        role: "Destination Photographer & Filmaker",
        bio: "A visual storyteller capturing the soul of Nigeria through compelling imagery that celebrates people, culture, and everyday life.",
        social: [
            { icon: "fa-brands fa-x-twitter", link: "https://x.com/alemiwara?s=21" },
            { icon: "fa-brands fa-instagram", link: "https://www.instagram.com/alemiwara?igsh=bDRoYjZpbHo3NzYx " }
        ]
    },
    {
        image: "images/img/niyi.webp",
        alt: "photo of Niyi Fagbemi",
        name: "Niyi Fagbemi",
        role: "Photographer & Visual Storyteller",
        bio: "A creative visual artist capturing the vibrance of Nigerian culture and the essence of human emotion through photography.",
        social: [
            { icon: "fa-brands fa-x-twitter", link: "https://x.com/theniyifagbemi?s=21" },
            { icon: "fa-brands fa-instagram", link: "https://www.instagram.com/theniyifagbemi?igsh=ZjF3cG82bXRjdW9j" }
        ]
    }
];

/**
 * Generates the HTML for the social icons in a team member card.
 */
function createSocialLinks(socialArray) {
    // The target="_blank" attribute is added here to open the link in a new tab.
    return socialArray.map(social => 
        `<a href="${social.link}" target="_blank"><i class="${social.icon}"></i></a>`
    ).join('');
}

/**
 * Generates the HTML string for a single team member card.
 */
function createTeamCard(member) {
    const socialLinks = createSocialLinks(member.social);
    
    return `
        <article class="team-member-card">
            <img src="${member.image}" alt="${member.alt}" loading="lazy">
            <div class="card-info">
                <h3>${member.name}</h3>
                <h4>${member.role}</h4>
                <p>${member.bio}</p>
                <div class="member-social">
                    ${socialLinks}
                </div>
            </div>
        </article>
    `;
}

/**
 * Finds the team grid container and populates it with all team member cards.
 */
function loadTeamMembers() {
    const gridContainer = document.querySelector('.team-grid');

    if (gridContainer) {
        // Generate HTML for each member and join them into a single string
        const cardsHTML = teamData.map(createTeamCard).join('');
        
        // Insert all cards into the container
        gridContainer.innerHTML = cardsHTML;
    }
}

// Run the function when the script loads
document.addEventListener('DOMContentLoaded', loadTeamMembers);