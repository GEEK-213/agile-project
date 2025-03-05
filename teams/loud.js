
// Player data
const players = [
    {
      id: 1,
      name: "Dgzin",
      role: "Duelist",
      image: "https://owcdn.net/img/6678dd36a6db2.png", // Using the placeholder image
      rating: "92",
      stats: {
        left: [
          { label: "K/D", value: "1.32", percentage: 66 },
          { label: "ACS", value: "256", percentage: 85 },
          { label: "FIRST BLOODS", value: "28%", percentage: 28 }
        ],
        right: [
          { label: "CLUTCHES", value: "35%", percentage: 35 },
          { label: "HS%", value: "82%", percentage: 82 },
          { label: "IMPACT", value: "1.25", percentage: 62 }
        ]
      },
      agents: "Jett, Raze, Yoru",
      matches: "187",
      badges: ["VCT CHAMPION", "TEAM STAR", "BEST DUELIST"]
    },
    {
      id: 2,
      name: "V1nny",
      role: "Initiator / Flex",
      image: "https://owcdn.net/img/65e0a6c63f312.png", // Placeholder
      rating: "89",
      stats: {
        left: [
          { label: "K/D", value: "1.28", percentage: 64 },
          { label: "ACS", value: "245", percentage: 82 },
          { label: "FIRST BLOODS", value: "26%", percentage: 26 }
        ],
        right: [
          { label: "CLUTCHES", value: "30%", percentage: 30 },
          { label: "HS%", value: "78%", percentage: 78 },
          { label: "IMPACT", value: "1.22", percentage: 61 }
        ]
      },
      agents: "Breach, Sova, Skye, Cypher",
      matches: "156",
      badges: ["VCT CHAMPION", "FLEX PLAYER"]
    },
    {
      id: 3,
      name: "pANcada",
      role: "Sentinel / Initiator",
      image: "https://owcdn.net/img/6416955d4ce03.png", // Placeholder
      rating: "88",
      stats: {
        left: [
          { label: "K/D", value: "1.15", percentage: 57 },
          { label: "ACS", value: "218", percentage: 73 },
          { label: "UTIL IMPACT", value: "92%", percentage: 92 }
        ],
        right: [
          { label: "KAST", value: "76%", percentage: 76 },
          { label: "FIRST BLOODS", value: "18%", percentage: 18 },
          { label: "IMPACT", value: "1.05", percentage: 52 }
        ]
      },
      agents: "Kay/o, Fade, Killjoy",
      matches: "165",
      badges: ["WORLD CHAMPION", "UTILITY MASTER"]
    },
    {
      id: 4,
      name: "Tuyz",
      role: "Controller / Duelist",
      image: "https://owcdn.net/img/66306e474531d.png", // Placeholder
      rating: "85",
      stats: {
        left: [
          { label: "K/D", value: "1.05", percentage: 52 },
          { label: "ACS", value: "198", percentage: 66 },
          { label: "UTIL IMPACT", value: "92%", percentage: 92 }
        ],
        right: [
          { label: "KAST", value: "81%", percentage: 81 },
          { label: "FIRST BLOODS", value: "15%", percentage: 15 },
          { label: "IMPACT", value: "0.98", percentage: 49 }
        ]
      },
      agents: "Astra, Omen, Jett",
      matches: "142",
      badges: ["SUPPORT SPECIALIST", "STRATEGIC MIND", "DOMINATOR"]
    },
    {
      id: 5,
      name: "Cauanzin",
      role: "Controller",
      image: "https://owcdn.net/img/66306e74ba40e.png", // Placeholder
      rating: "87",
      stats: {
        left: [
          { label: "K/D", value: "1.12", percentage: 56 },
          { label: "ACS", value: "210", percentage: 70 },
          { label: "SITE HOLD", value: "86%", percentage: 86 }
        ],
        right: [
          { label: "UTIL IMPACT", value: "88%", percentage: 88 },
          { label: "KAST", value: "79%", percentage: 79 },
          { label: "IMPACT", value: "1.08", percentage: 54 }
        ]
      },
      agents: "Viper, Harbor, Brimstone",
      matches: "172",
      badges: ["WORLD CHAMPION", "SITE ANCHOR", "RISING STAR"]
    }
  ];
  
  // Initialize variables
  let currentIndex = 0;
  let slidingDirection = null;
  let isAnimating = false;
  
  // Variables for swipe/drag functionality
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let dragSensitivity = 100; // Minimum drag distance to trigger slide
  
  // DOM elements
  let playerCards = [];
  let paginationDots = [];
  let carouselContainer;
  let cardsContainer;
  
  // Initialize the carousel when the DOM is loaded
  document.addEventListener('DOMContentLoaded', initializeCarousel);
  
  function initializeCarousel() {
    carouselContainer = document.querySelector('.carousel-container');
    cardsContainer = document.querySelector('.player-cards');
    
    // Create player cards and pagination dots
    players.forEach((player, index) => {
      // Create player card
      const card = createPlayerCard(player);
      cardsContainer.appendChild(card);
      playerCards.push(card);
      
      // Create pagination dot
      const paginationContainer = document.querySelector('.pagination');
      const dot = document.createElement('div');
      dot.classList.add('pagination-dot');
      dot.addEventListener('click', () => goToPlayer(index));
      paginationContainer.appendChild(dot);
      paginationDots.push(dot);
    });
  
    // Setup navigation buttons
    document.querySelector('.prev-button').addEventListener('click', goToPrevPlayer);
    document.querySelector('.next-button').addEventListener('click', goToNextPlayer);
  
    // Setup mouse/touch events for swipe
    cardsContainer.addEventListener('mousedown', dragStart);
    cardsContainer.addEventListener('touchstart', dragStart, { passive: true });
    cardsContainer.addEventListener('mouseup', dragEnd);
    cardsContainer.addEventListener('touchend', dragEnd);
    cardsContainer.addEventListener('mouseleave', dragEnd);
    cardsContainer.addEventListener('mousemove', drag);
    cardsContainer.addEventListener('touchmove', drag, { passive: true });
  
    // Initialize with first player
    updateCarousel();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
  }
  
  function createPlayerCard(player) {
    const card = document.createElement('div');
    card.classList.add('player-card');
    
    // Player rating
    const ratingElem = document.createElement('div');
    ratingElem.classList.add('player-rating');
    ratingElem.textContent = player.rating;
    card.appendChild(ratingElem);
    
    // Player badges
    const badgesContainer = document.createElement('div');
    badgesContainer.classList.add('player-badges');
    
    player.badges.forEach(badgeText => {
      const badge = document.createElement('div');
      badge.classList.add('badge');
      badge.textContent = badgeText;
      badgesContainer.appendChild(badge);
    });
    
    card.appendChild(badgesContainer);
    
    // Player image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('player-image-container');
    
    const imageGlow = document.createElement('div');
    imageGlow.classList.add('player-image-glow');
    imageContainer.appendChild(imageGlow);
    
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('player-image');
    
    const image = document.createElement('img');
    image.src = player.image;
    image.alt = player.name;
    imageWrapper.appendChild(image);
    
    imageContainer.appendChild(imageWrapper);
    card.appendChild(imageContainer);
    
    // Player info
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('player-info');
    
    // Player name
    const nameElem = document.createElement('h3');
    nameElem.classList.add('player-name');
    nameElem.textContent = player.name;
    infoContainer.appendChild(nameElem);
    
    // Player role
    const roleElem = document.createElement('div');
    roleElem.classList.add('player-role');
    roleElem.textContent = player.role;
    infoContainer.appendChild(roleElem);
    
    // Stats grid
    const statsGrid = document.createElement('div');
    statsGrid.classList.add('stats-grid');
    
    // Left stats column
    const leftStatsColumn = document.createElement('div');
    leftStatsColumn.classList.add('stats-column');
    
    player.stats.left.forEach(stat => {
      const statElem = createStatElement(stat.label, stat.value, stat.percentage);
      leftStatsColumn.appendChild(statElem);
    });
    
    statsGrid.appendChild(leftStatsColumn);
    
    // Right stats column
    const rightStatsColumn = document.createElement('div');
    rightStatsColumn.classList.add('stats-column');
    
    player.stats.right.forEach(stat => {
      const statElem = createStatElement(stat.label, stat.value, stat.percentage);
      rightStatsColumn.appendChild(statElem);
    });
    
    statsGrid.appendChild(rightStatsColumn);
    infoContainer.appendChild(statsGrid);
    
    // Player footer
    const footerElem = document.createElement('div');
    footerElem.classList.add('player-footer');
    
    const agentsElem = document.createElement('div');
    agentsElem.textContent = player.agents;
    footerElem.appendChild(agentsElem);
    
    const matchesElem = document.createElement('div');
    matchesElem.textContent = `${player.matches} Matches`;
    footerElem.appendChild(matchesElem);
    
    infoContainer.appendChild(footerElem);
    card.appendChild(infoContainer);
    
    return card;
  }
  
  function createStatElement(label, value, percentage) {
    const statElem = document.createElement('div');
    statElem.classList.add('stat');
    
    const headerElem = document.createElement('div');
    headerElem.classList.add('stat-header');
    
    const labelElem = document.createElement('span');
    labelElem.classList.add('stat-label');
    labelElem.textContent = label;
    headerElem.appendChild(labelElem);
    
    const valueElem = document.createElement('span');
    valueElem.classList.add('stat-value');
    valueElem.textContent = value;
    headerElem.appendChild(valueElem);
    
    statElem.appendChild(headerElem);
    
    const barElem = document.createElement('div');
    barElem.classList.add('stat-bar');
    
    const fillElem = document.createElement('div');
    fillElem.classList.add('stat-fill');
    fillElem.style.width = `${percentage}%`;
    barElem.appendChild(fillElem);
    
    statElem.appendChild(barElem);
    
    return statElem;
  }
  
  function updateCarousel() {
    // Update player cards
    playerCards.forEach((card, index) => {
      // Remove all status classes
      card.classList.remove('active', 'prev', 'next');
      
      // Add appropriate class based on position
      if (index === currentIndex) {
        card.classList.add('active');
      } else if (index === getPrevIndex()) {
        card.classList.add('prev');
      } else if (index === getNextIndex()) {
        card.classList.add('next');
      }
    });
    
    // Update pagination dots
    paginationDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
    
    // Reset sliding direction
    slidingDirection = null;
  }
  
  function getPrevIndex() {
    return (currentIndex - 1 + players.length) % players.length;
  }
  
  function getNextIndex() {
    return (currentIndex + 1) % players.length;
  }
  
  function goToPrevPlayer() {
    if (isAnimating) return;
    isAnimating = true;
    
    slidingDirection = 'left';
    
    setTimeout(() => {
      currentIndex = getPrevIndex();
      updateCarousel();
      isAnimating = false;
    }, 0);
  }
  
  function goToNextPlayer() {
    if (isAnimating) return;
    isAnimating = true;
    
    slidingDirection = 'right';
    
    setTimeout(() => {
      currentIndex = getNextIndex();
      updateCarousel();
      isAnimating = false;
    }, 0);
  }
  
  function goToPlayer(index) {
    if (isAnimating || index === currentIndex) return;
    
    isAnimating = true;
    
    slidingDirection = index > currentIndex ? 'right' : 'left';
    
    setTimeout(() => {
      currentIndex = index;
      updateCarousel();
      isAnimating = false;
    }, 300);
  }
  
  function handleKeyNavigation(e) {
    if (e.key === 'ArrowLeft') {
      goToPrevPlayer();
    } else if (e.key === 'ArrowRight') {
      goToNextPlayer();
    }
  }
  
  // Swipe/drag functionality
  function dragStart(event) {
    if (isAnimating) return;
    
    isDragging = true;
    startX = getPositionX(event);
    
    // Stop any momentum animation
    cancelAnimationFrame(animationID);
  }
  
  function drag(event) {
    if (!isDragging) return;
    
    const currentX = getPositionX(event);
    const diffX = currentX - startX;
    
    // Add a visual cue that the card is being dragged
    cardsContainer.style.cursor = 'grabbing';
    
    // Optional: Add some visual feedback during drag
    playerCards[currentIndex].style.transform = `translateX(${diffX}px)`;
    
    if (diffX > 0) {
      // Dragging right, show prev card
      if (playerCards[getPrevIndex()]) {
        playerCards[getPrevIndex()].classList.add('prev');
      }
    } else if (diffX < 0) {
      // Dragging left, show next card
      if (playerCards[getNextIndex()]) {
        playerCards[getNextIndex()].classList.add('next');
      }
    }
  }
  
  function dragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    const currentX = playerCards[currentIndex].style.transform;
    const dragDistance = parseInt(currentX.replace('translateX(', '')) || 0;
    
    // Reset the cursor and transform
    cardsContainer.style.cursor = 'grab';
    playerCards[currentIndex].style.transform = '';
    
    // Check if drag was significant enough to trigger a slide
    if (dragDistance > dragSensitivity) {
      goToPrevPlayer();
    } else if (dragDistance < -dragSensitivity) {
      goToNextPlayer();
    } else {
      // Not enough drag, revert back
      updateCarousel();
    }
  }
  
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  