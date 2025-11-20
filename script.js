const startBtn = document.getElementById('startBtn');
const typewriter = document.getElementById('typewriter');
const subtext = document.getElementById('subtext');
const trollNote = document.getElementById('trollNote');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const buttons = document.getElementById('buttons');
const lights = document.getElementById('emergencyLights');
const white = document.getElementById('whiteOverlay');
const canvas = document.getElementById('scratchCanvas');
const secretContent = document.getElementById('secretContent');
const finalNote = document.getElementById('finalNote');

const bgMusic = document.getElementById('bgMusic');
const typeSound = document.getElementById('typeSound');
const siren = document.getElementById('siren');

let attempts = 0;
let typingInterval = null;

// Typewriter effect with auto-stop sound
function typeWriter(text, el, speed, callback) {
    el.style.opacity = 1;
    el.innerHTML = '';
    let i = 0;
    typeSound.currentTime = 0;
    typeSound.play();
    
    if (typingInterval) clearInterval(typingInterval);
    
    typingInterval = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text[i];
            i++;
        } else {
            clearInterval(typingInterval);
            typeSound.pause();
            typeSound.currentTime = 0;
            if (callback) callback();
        }
    }, speed);
}

// Start button click
startBtn.onclick = () => {
    startBtn.remove();
    bgMusic.play();
    
    typeWriter("Why are you here? Do you want to know what lies behind the darkness?", typewriter, 110, () => {
        typeWriter("If yes then press red. If not then go for green.", subtext, 90, () => {
            buttons.style.opacity = 1;
        });
    });
};

// NO button hover and click
function handleNoButton(e) {
    e.preventDefault();
    attempts++;
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.random() * (innerWidth - 250) + 'px';
    noBtn.style.top = Math.random() * (innerHeight - 180) + 'px';
    noBtn.style.animation = 'vibrate 0.7s';
    
    yesBtn.classList.add('glow');
    setTimeout(() => yesBtn.classList.remove('glow'), 1200);
    
    // Show troll note ONLY after exactly 6 attempts
    if (attempts === 6) {
        typeWriter("Maybe the button doesn't want to let you touch it. Try the other one.", trollNote, 100);
    }
}

noBtn.onmouseenter = handleNoButton;
noBtn.onclick = handleNoButton;

// YES button click
yesBtn.onclick = () => {
    buttons.style.opacity = 0;
    typewriter.style.opacity = 0;
    subtext.style.opacity = 0;
    trollNote.style.opacity = 0;
    
    lights.style.opacity = 1;
    siren.play();

    // After 6 seconds, stop emergency
    setTimeout(() => {
        lights.style.opacity = 0;
        siren.pause();
        siren.currentTime = 0;
        
        // Fade to white over 8 seconds
        let opacity = 0;
        const fadeInterval = setInterval(() => {
            opacity += 0.0125;
            white.style.opacity = opacity;
            
            if (opacity >= 1) {
                clearInterval(fadeInterval);
                
                // Show scratch canvas after 0.5s
                setTimeout(() => {
                    canvas.style.opacity = 1;
                    canvas.style.pointerEvents = 'auto';
                    secretContent.style.opacity = 1;
                    initCanvas();
                    startNoteFade();
                }, 500);
            }
        }, 100);
    }, 6000);
};

// Initialize scratch canvas with scratchcover.jpeg
function initCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
        // Fill entire screen with image (cover effect)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.globalCompositeOperation = 'destination-out';
    };
    img.src = 'scratchcover.jpeg';
}

// Scratch effect
let isDrawing = false;

canvas.onmousedown = () => isDrawing = true;
canvas.onmouseup = () => isDrawing = false;
canvas.onmouseleave = () => isDrawing = false;

canvas.onmousemove = (e) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
};

canvas.ontouchstart = (e) => {
    e.preventDefault();
    isDrawing = true;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
};

canvas.ontouchmove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
};

canvas.ontouchend = () => isDrawing = false;

function scratch(x, y) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 70, 0, Math.PI * 2);
    ctx.fill();
    
    // Check if scratched enough (60%)
    checkScratchProgress();
}

function checkScratchProgress() {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparent++;
    }
    
    const scratchedPercent = transparent / (pixels.length / 4);
    
    if (scratchedPercent > 0.6) {
        revealContent();
    }
}

function revealContent() {
    canvas.style.transition = 'opacity 1s';
    canvas.style.opacity = 0;
    canvas.style.pointerEvents = 'none';
    secretContent.style.pointerEvents = 'auto';
}

// Note fade in/out animation
function startNoteFade() {
    setInterval(() => {
        if (finalNote.style.opacity === '0' || finalNote.style.opacity === '') {
            finalNote.style.transition = 'opacity 2s';
            finalNote.style.opacity = '1';
        } else {
            finalNote.style.transition = 'opacity 2s';
            finalNote.style.opacity = '0';
        }
    }, 4000);
}

// Copy button
document.getElementById('copyBtn').onclick = () => {
    navigator.clipboard.writeText('20.11.2001');
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
};

// Prevent page reload on resize (optional)
window.onresize = () => {
    if (canvas.style.opacity === '1') {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initCanvas();
    }
};
