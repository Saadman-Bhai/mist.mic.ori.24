// Initialize Lucide icons
lucide.createIcons();

// Smooth scrolling for navigation and back-to-top buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// --- Particle Background Animation ---
window.onload = function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    // Set canvas size and add event listener for resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.getElementById('hero').offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle constructor
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Method to draw a single particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Method to update particle position
        update() {
            // Reverse direction if particle hits a boundary
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Update position
            this.x += this.directionX;
            this.y += this.directionY;

            // Draw the updated particle
            this.draw();
        }
    }

    // Create particle array
    function init() {
        particlesArray = [];
        // Increased the number of particles for a denser effect
        const numberOfParticles = (canvas.height * canvas.width) / 5000;
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 5) + 1;
            const x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            const directionX = (Math.random() * 0.5) - 0.25;
            const directionY = (Math.random() * 0.5) - 0.25;
            // Changed color to a semi-transparent white
            const color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
    
    // Function to connect the particles with lines
    function connect() {
        // The distance threshold for drawing a line
        const maxDistance = 120;
        
        // Loop through all particles
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const distance = ((particlesArray[a].x - particlesArray[b].x) ** 2 + 
                                  (particlesArray[a].y - particlesArray[b].y) ** 2) ** 0.5;
                
                // Check if the distance is within the threshold
                if (distance < maxDistance) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw each particle
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        
        // Connect the particles
        connect();
    }

    // Start the animation
    init();
    animate();
};