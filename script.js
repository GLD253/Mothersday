// Update personal message
function updateMessage() {
    const input = document.getElementById('messageInput');
    const display = document.getElementById('displayMessage');
    
    if (input.value.trim()) {
        display.textContent = input.value;
        input.value = '';
        
        // Add animation
        display.style.animation = 'none';
        setTimeout(() => {
            display.style.animation = 'messageAppear 0.5s ease-out';
        }, 10);
    }
}

// Add animation for message
const style = document.createElement('style');
style.textContent = `
    @keyframes messageAppear {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Allow Enter key to submit message
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        updateMessage();
    }
});

// Confetti animation
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confetti = [];

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 5 + 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.colors = ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1', '#ffa500', '#ff69b4'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.1; // gravity
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function triggerConfetti() {
    // Create lots of confetti pieces
    for (let i = 0; i < 100; i++) {
        confetti.push(new ConfettiPiece());
    }

    // Play celebration sound (optional browser beep)
    playSound();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confetti.length - 1; i >= 0; i--) {
        confetti[i].update();
        confetti[i].draw();

        // Remove off-screen confetti
        if (confetti[i].y > canvas.height) {
            confetti.splice(i, 1);
        }
    }

    if (confetti.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// Hearts animation
function triggerHearts() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 100);
    }
}

function createHeart() {
    const container = document.getElementById('heartsContainer');
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '💕';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    
    container.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Reset card
function resetCard() {
    document.getElementById('displayMessage').textContent = 'Click below to add a special message!';
    document.getElementById('messageInput').value = '';
    const player = document.getElementById('songPlayer');
    player.pause();
    player.currentTime = 0;
}

// Confetti animation loop starter
canvas.addEventListener('click', () => {
    if (confetti.length === 0) {
        triggerConfetti();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Play celebration sound
function playSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Start confetti animation when triggered
const originalTrigger = window.triggerConfetti;
window.triggerConfetti = function() {
    originalTrigger();
    animateConfetti();
};
