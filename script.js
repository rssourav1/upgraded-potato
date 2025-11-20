// DOM Elements
const startButton = document.getElementById('startButton');
const firstText = document.getElementById('firstText');
const secondText = document.getElementById('secondText');
const trollText = document.getElementById('trollText');
const buttonsContainer = document.getElementById('buttonsContainer');
const greenBtn = document.getElementById('greenBtn');
const redBtn = document.getElementById('redBtn');
const emergencyLights = document.getElementById('emergencyLights');
const scratchCanvas = document.getElementById('scratchCanvas');
const revealContent = document.getElementById('revealContent');
const copyButton = document.getElementById('copyButton');

// Audio Elements
const bgMusic = document.getElementById('bgMusic');
const typingSound = document.getElementById('typingSound');
const sirenSound = document.getElementById('sirenSound');

// Game State
let greenAttempts = 0;
let typingInterval = null;

// ========== PHASE 1: Start Button ==========
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    bgMusic.volume = 0.5;
    bgMusic.play();
    
    // Start typewriter sequence
    typeText(
        "Why are you here? Do you want to know what lies behind the darkness?",
        firstText,
        () => {
            typeText(
                "If yes then press red. If not then go for green.",
                secondText,
                () => {
                    // Show buttons after second text
                    buttonsContainer.style.opacity = '1';
                }
            );
        }
    );
});

// ========== PHASE 2: Typewriter Effect ==========
function typeText(text, element, callback) {
    element.style.opacity = '1';
    element.textContent = '';
    let index = 0;
    
    // Play typing sound
    typingSound.currentTime = 0;
    typingSound.loop = true;
    typingSound.volume = 0.3;
    typingSound.play();
    
    typingInterval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(typingInterval);
            typingSound.pause();
            typingSound.currentTime = 0;
            if (callback) callback();
        }
    }, 80);
}

// ========== PHASE 3: Green Button Troll ==========
function handleGreenButton(event) {
    event.preventDefault();
    greenAttempts++;
    
    // Random position (avoiding edges)
    const maxX = window.innerWidth - 300;
    const maxY = window.innerHeight - 150;
    const randomX = Math.random() * (maxX - 100) + 50;
    const randomY = Math.random() * (maxY - 100) + 50;
    
    greenBtn.style.position = 'fixed';
    greenBtn.style.left = randomX + 'px';
    greenBtn.style.top = randomY + 'px';
    
    // Vibrate animation
    greenBtn.classList.add('vibrating');
    setTimeout(() => greenBtn.classList.remove('vibrating'), 500);
    
    // Red button glow
    redBtn.classList.add('glow');
    setTimeout(() => redBtn.classList.remove('glow'), 800);
    
    // Show troll note after exactly 6 attempts
    if (greenAttempts === 6) {
        typeText(
            "Maybe the button doesn't want to let you touch it. Try the other one.",
            trollText,
            null
        );
    }
}

greenBtn.addEventListener('mouseenter', handleGreenButton);
greenBtn.addEventListener('click', handleGreenButton);

// ========== PHASE 4: Red Button - Emergency ==========
redBtn.addEventListener('click', () => {
    // Fade out all text and buttons
    firstText.style.opacity = '0';
    secondText.style.opacity = '0';
    trollText.style.opacity = '0';
    buttonsContainer.style.opacity = '0';
    
    // Show emergency lights
    emergencyLights.classList.add('active');
    
    // Play siren for exactly 6 seconds
    sirenSound.volume = 0.6;
    sirenSound.play();
    
    setTimeout(() => {
        sirenSound.pause();
        sirenSound.currentTime = 0;
    }, 6000);
    
    // After 6 seconds, fade out lights and show scratch canvas
    setTimeout(() => {
        emergencyLights.classList.remove('active');
        
        setTimeout(() => {
            initializeScratchCanvas();
        }, 500);
    }, 6000);
});

// ========== PHASE 5: Scratch Canvas ==========
function initializeScratchCanvas() {
    scratchCanvas.style.display = 'block';
    revealContent.style.display = 'flex';
    
    const canvas = scratchCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Load and draw scratch cover image
    const coverImage = new Image();
    coverImage.onload = () => {
        // Scale image to cover full screen
        const scale = Math.max(
            canvas.width / coverImage.width,
            canvas.height / coverImage.height
        );
        
        const x = (canvas.width - coverImage.width * scale) / 2;
        const y = (canvas.height - coverImage.height * scale) / 2;
        
        ctx.drawImage(
            coverImage,
            x, y,
            coverImage.width * scale,
            coverImage.height * scale
        );
        
        // Set composite mode for erasing
        ctx.globalCompositeOperation = 'destination-out';
    };
    coverImage.src = 'scratchcover.jpeg';
    
    // Scratch functionality
    let isScratching = false;
    
    canvas.addEventListener('mousedown', () => isScratching = true);
    canvas.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mouseleave', () => isScratching = false);
    
    canvas.addEventListener('mousemove', (e) => {
        if (isScratching) {
            scratch(e.clientX, e.clientY);
        }
    });
    
    canvas.addEventListener('touchstart', (e) => {
        isScratching = true;
        const touch = e.touches[0];
        scratch(touch.clientX, touch.clientY);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isScratching) {
            const touch = e.touches[0];
            scratch(touch.clientX, touch.clientY);
        }
    });
    
    canvas.addEventListener('touchend', () => isScratching = false);
    
    function scratch(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ========== PHASE 6: Copy Button ==========
copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText('20.11.2001').then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = 'Copy';
        }, 2000);
    });
});
