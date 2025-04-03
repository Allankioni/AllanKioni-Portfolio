/**
 * Portfolio Website Main JavaScript
 * Author: Allan Muhoro Kioni
 * Description: Handles all interactive elements on the portfolio site
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Theme management initialization
    initThemeManager();
    
    // 3D Button Effect initialization
    init3DButton();
    
    // Initialize AOS animations
    initAOS();
    
    // Book animation initialization
    initBookAnimation();
    
    // Fix "Read Article" links
    fixReadMoreLinks();
    
    // Additional fix for Read Full Article links
    fixReadFullArticleLinks();
});

// Window load event
window.addEventListener('load', () => {
    // Initialize canvas animations
    initCanvasAnimations();
});

/**
 * Theme Manager: Handles theme selection and storage
 */
function initThemeManager() {
    const themeMenuBtn = document.getElementById('themeMenuBtn');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    if (!themeMenuBtn || !themeDropdown) {
        console.error('Theme elements not found');
        return;
    }
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'natural';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set active class on current theme option
    themeOptions.forEach(option => {
        if (option.dataset.theme === savedTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Toggle theme dropdown
    themeMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        themeDropdown.classList.toggle('active');
        console.log('Theme dropdown toggled');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.theme-selector')) {
            themeDropdown.classList.remove('active');
        }
    });
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update active class
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * 3D Interactive Button Effect
 * Handles the CTA button interactive effects
 */
function init3DButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        // Mouse move effect for 3D rotation
        ctaButton.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation values based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate the rotation angle (limited to ±15 degrees)
            const rotateY = ((x - centerX) / centerX) * 15;
            const rotateX = -((y - centerY) / centerY) * 15;
            
            // Apply the transformation with more intense values when directly hovering
            this.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(15px)
                scale(1.05)
            `;
            
            // Dynamic shadow based on mouse position
            const shadowX = (x - centerX) / 10;
            const shadowY = (y - centerY) / 10;
            this.style.boxShadow = `
                ${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.2),
                0 10px 20px rgba(0, 0, 0, 0.15),
                0 0 20px 5px rgba(46, 204, 113, 0.2)
            `;
            
            // Control the light beam
            const lightBeam = this.querySelector('.light-beam');
            if (lightBeam) {
                // Position the light beam based on mouse position
                const beamPos = (x / rect.width) * 100;
                lightBeam.style.left = `${beamPos}%`;
                lightBeam.style.opacity = '1';
                
                // Add additional glow effect
                const glowIntensity = Math.max(0, 1 - Math.sqrt(
                    Math.pow((x - centerX) / centerX, 2) + 
                    Math.pow((y - centerY) / centerY, 2)
                ));
                
                const glowColor = `rgba(46, 204, 113, ${glowIntensity * 0.5})`;
                this.style.boxShadow = `
                    ${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.2),
                    0 10px 20px rgba(0, 0, 0, 0.15),
                    0 0 30px 8px ${glowColor}
                `;
            }
            
            // Pause the bounce animation when hovering
            this.style.animation = 'none';
        });
        
        // Reset on mouse leave
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)';
            
            // Restart the bounce animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'bounce 2s infinite';
            }, 10);
        });
        
        // On click effect
        ctaButton.addEventListener('mousedown', function() {
            this.style.transform = 'perspective(1000px) translateY(2px) translateZ(5px)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        });
        
        // Reset after click
        ctaButton.addEventListener('mouseup', function(event) {
            const rect = this.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 15;
            const rotateX = -((y - centerY) / centerY) * 15;
            
            this.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(10px)
            `;
        });
        
        // Add a subtle floating effect when the page loads
        setTimeout(() => {
            if (!ctaButton.matches(':hover')) {
                ctaButton.style.animation = 'bounce 2s infinite';
            }
        }, 2000);
        
        // Add parallax depth effect for whole page movement
        document.addEventListener('mousemove', function(e) {
            if (!ctaButton.matches(':hover')) {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                // Calculate a small movement based on mouse position
                const moveX = (mouseX - 0.5) * 10;
                const moveY = (mouseY - 0.5) * 10;
                
                // Apply a subtle parallax effect when not directly hovering
                ctaButton.style.transform = `
                    perspective(1000px)
                    rotateX(${moveY}deg)
                    rotateY(${moveX}deg)
                    translateZ(5px)
                    translateX(${moveX / 2}px)
                    translateY(${moveY / 2}px)
                `;
            }
        });
        
        // Add touch support for mobile devices
        ctaButton.addEventListener('touchmove', function(e) {
            e.preventDefault();
            
            const touch = e.touches[0];
            const rect = this.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 15;
            const rotateX = -((y - centerY) / centerY) * 15;
            
            this.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(10px)
            `;
        });

        // Ensure CTA button is always visible - failsafe
        ctaButton.style.opacity = '1';
        ctaButton.style.visibility = 'visible';
        ctaButton.style.display = 'inline-block';
        
        // Start animation after a short delay
        setTimeout(() => {
            if (!ctaButton.matches(':hover')) {
                ctaButton.style.animation = 'bounce 2s infinite';
            }
        }, 500);
    }
}

/**
 * Canvas Background Animations
 * Handles the interactive background animations
 */
function initCanvasAnimations() {
    const canvas = document.getElementById('interactive-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let touchActive = false;
    let animationMode = 'particles'; // Default animation mode
    let matrixColumns = [];
    let wavePoints = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Reinitialize based on current animation
        if (animationMode === 'particles') {
            initParticles();
        } else if (animationMode === 'matrix') {
            initMatrix();
        } else if (animationMode === 'waves') {
            initWaves();
        }
    }

    // Initialize particles animation
    function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 10000), 150);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    // Initialize matrix animation
    function initMatrix() {
        matrixColumns = [];
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        
        for (let i = 0; i < columns; i++) {
            matrixColumns[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
        }
    }

    // Initialize waves animation
    function initWaves() {
        wavePoints = [];
        const pointCount = Math.floor(canvas.width / 20);
        
        for (let i = 0; i <= pointCount; i++) {
            wavePoints.push({
                x: (canvas.width / pointCount) * i,
                y: canvas.height / 2,
                originalY: canvas.height / 2,
                speed: 0.05 + Math.random() * 0.05,
                amp: 20 + Math.random() * 20,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    // Draw particles animation
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get theme for color adaptation
        const theme = document.documentElement.getAttribute('data-theme');
        const primaryColor = theme === 'dark' ? '#3498db' : '#3498db';
        const secondaryColor = theme === 'dark' ? '#2ecc71' : '#2ecc71';
        
        particles.forEach(particle => {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around canvas
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
            
            // Influence particles with mouse position if active
            if (mouseX && mouseY) {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = 0.5 * (1 - distance / 150);
                    particle.speedX = particle.speedX * 0.9 - Math.cos(angle) * force;
                    particle.speedY = particle.speedY * 0.9 - Math.sin(angle) * force;
                }
            }
            
            // Draw particle
            ctx.beginPath();
            const gradient = ctx.createLinearGradient(
                particle.x, particle.y, 
                particle.x + particle.size, particle.y + particle.size
            );
            gradient.addColorStop(0, primaryColor);
            gradient.addColorStop(1, secondaryColor);
            
            ctx.fillStyle = gradient;
            ctx.globalAlpha = particle.opacity;
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw connections between nearby particles
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = theme === 'dark' ? '#3498db' : '#3498db';
                    ctx.globalAlpha = 0.2 * (1 - distance / 100);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        ctx.globalAlpha = 1;
        if (animationMode === 'particles') {
            requestAnimationFrame(drawParticles);
        }
    }

    // Draw matrix animation
    function drawMatrix() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const theme = document.documentElement.getAttribute('data-theme');
        const color = theme === 'dark' ? '#3498db' : '#2ecc71';
        
        ctx.fillStyle = color;
        ctx.font = '14px monospace';
        
        // Draw each column
        matrixColumns.forEach((y, index) => {
            // Generate random character
            const char = String.fromCharCode(33 + Math.floor(Math.random() * 94));
            
            // Position for the character
            const x = index * 14;
            
            // Draw the character
            ctx.fillText(char, x, y * 14);
            
            // Move character down
            matrixColumns[index] = y > 100 + Math.random() * 10000 ? 0 : y + 1;
        });
        
        if (animationMode === 'matrix') {
            requestAnimationFrame(drawMatrix);
        }
    }

    // Draw waves animation
    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const theme = document.documentElement.getAttribute('data-theme');
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#3498db');
        gradient.addColorStop(0.5, '#9b59b6');
        gradient.addColorStop(1, '#2ecc71');
        
        // Update wave points
        wavePoints.forEach(point => {
            point.phase += point.speed;
            point.y = point.originalY + Math.sin(point.phase) * point.amp;
            
            // Influence waves with mouse position
            if (mouseX && mouseY) {
                const dx = mouseX - point.x;
                const dy = mouseY - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    point.y += (mouseY - point.y) * 0.03;
                }
            }
        });
        
        // Draw wave paths
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(wavePoints[0].x, wavePoints[0].y);
        
        // Create smooth curves between points
        for (let i = 0; i < wavePoints.length - 1; i++) {
            const xc = (wavePoints[i].x + wavePoints[i + 1].x) / 2;
            const yc = (wavePoints[i].y + wavePoints[i + 1].y) / 2;
            ctx.quadraticCurveTo(wavePoints[i].x, wavePoints[i].y, xc, yc);
        }
        
        ctx.lineTo(canvas.width, wavePoints[wavePoints.length - 1].y);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        
        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        
        if (animationMode === 'waves') {
            requestAnimationFrame(drawWaves);
        }
    }

    // Start current animation
    function startAnimation() {
        if (animationMode === 'particles') {
            initParticles();
            drawParticles();
        } else if (animationMode === 'matrix') {
            initMatrix();
            drawMatrix();
        } else if (animationMode === 'waves') {
            initWaves();
            drawWaves();
        }
        
        // Update animation toggle button
        const animToggle = document.getElementById('animationToggle');
        if (animToggle) {
            animToggle.setAttribute('data-mode', animationMode);
        }
    }

    // Toggle between animation modes
    function toggleAnimation() {
        // Clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Cycle through animation modes
        if (animationMode === 'particles') {
            animationMode = 'matrix';
        } else if (animationMode === 'matrix') {
            animationMode = 'waves';
        } else {
            animationMode = 'particles';
        }
        
        // Start the new animation
        startAnimation();
        
        // Save preference
        localStorage.setItem('animationMode', animationMode);
    }

    // Check for saved animation preference
    const savedAnimation = localStorage.getItem('animationMode');
    if (savedAnimation) {
        animationMode = savedAnimation;
    }
    
    resizeCanvas();
    startAnimation();
    
    // Set up animation toggle button
    const animToggle = document.getElementById('animationToggle');
    if (animToggle) {
        animToggle.addEventListener('click', toggleAnimation);
    }
    
    // Mouse movement tracking
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Touch movement tracking
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            touchActive = true;
        }
    });

    window.addEventListener('touchend', () => {
        touchActive = false;
        setTimeout(() => {
            if (!touchActive) {
                mouseX = null;
                mouseY = null;
            }
        }, 3000);
    });

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
}

/**
 * Initialize AOS (Animate On Scroll)
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
}

/**
 * Book Animation
 */
function initBookAnimation() {
    const scrollBook = document.getElementById('scrollBook');
    if (!scrollBook) return;
    
    const bookObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        scrollBook.classList.add('open');
                    }, 300);
                } else {
                    scrollBook.classList.remove('open');
                }
            });
        },
        { threshold: 0.5 }
    );
    
    bookObserver.observe(scrollBook);
}

/**
 * Project filtering functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Tech Stack Filtering
    const techFilterButtons = document.querySelectorAll('.tech-filter-btn');
    const techItems = document.querySelectorAll('.tech-item');

    techFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            techFilterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            techItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'inline-block';
                    item.style.animation = 'floatIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Make tech items flip on click
    techItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('flipped');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        },
        { threshold: 0.2 }
    );

    timelineItems.forEach(item => timelineObserver.observe(item));

    // Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = navLinks.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            }
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Here you would typically send the data to your backend
                console.log('Form submitted:', data);
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error sending your message. Please try again later.');
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        function checkScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        window.addEventListener('scroll', checkScroll);
        // Initialize on page load
        checkScroll();
    }
    
    // Initialize ScrollReveal
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.project-card', { 
            delay: 200,
            distance: '20px',
            origin: 'bottom',
            interval: 100
        });

        ScrollReveal().reveal('.blog-card', {
            delay: 200,
            distance: '20px',
            origin: 'bottom',
            interval: 100
        });

        ScrollReveal().reveal('.testimonial-card', {
            delay: 200,
            distance: '20px',
            origin: 'bottom',
            interval: 100
        });
    }
});

/**
 * Fix "Read More" links in blog section
 */
function fixReadMoreLinks() {
    // Target both .read-more and .article-link classes
    const readMoreLinks = document.querySelectorAll('.read-more, .article-link');
    
    // First directly handle specific IDs we know exist
    const webDevArticle = document.getElementById('webDevArticle');
    const iotArticle = document.getElementById('iotArticle');
    
    if (webDevArticle) {
        setupArticleLink(webDevArticle, 'https://www.geeksforgeeks.org/future-of-web-development/');
    }
    
    if (iotArticle) {
        setupArticleLink(iotArticle, 'https://www.techtarget.com/iotagenda/definition/smart-city');
    }
    
    // Then handle any other read-more links
    if (readMoreLinks.length === 0) {
        console.log('No Read More links found');
        return;
    }
    
    readMoreLinks.forEach(link => {
        // Skip the ones we already set up by ID
        if (link.id === 'webDevArticle' || link.id === 'iotArticle') {
            return;
        }
        
        processLink(link);
    });
    
    console.log('Read More links initialized:', readMoreLinks.length);
    
    // Helper function to set up direct link function
    function setupArticleLink(linkElement, url) {
        // Clear any existing onclick attributes
        linkElement.removeAttribute('onclick');
        
        // Add fresh event listener
        linkElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Opening article URL:', url);
            try {
                window.open(url, '_blank', 'noopener,noreferrer');
            } catch (error) {
                console.error('Error opening window:', error);
                window.location.href = url;
            }
            return false;
        }, true);
        
        // Ensure all proper attributes
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('target', '_blank');
        linkElement.setAttribute('rel', 'noopener noreferrer');
        
        // Set a direct onclick handler as additional fallback
        linkElement.setAttribute('onclick', `window.open('${url}', '_blank', 'noopener,noreferrer'); return false;`);
    }
    
    // Helper function to process each link
    function processLink(link) {
        // Ensure the link has target="_blank" and rel="noopener noreferrer"
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Get the href for direct access
        const href = link.getAttribute('href');
        
        // Setup direct click handler
        if (href && href !== '#') {
            // Add click event to ensure it works
            link.addEventListener('click', function(e) {
                e.preventDefault();
                try {
                    // Use the direct URL value from href
                    window.open(href, '_blank', 'noopener,noreferrer');
                    console.log('Successfully opened link:', href);
                } catch (error) {
                    console.error('Error opening link:', error);
                    // Fallback: direct navigation
                    window.location.href = href;
                }
                return false;
            });
        }
    }
}

/**
 * Direct fix for Read Full Article links shown in screenshot
 */
function fixReadFullArticleLinks() {
    // For maximum reliability, add global click handler for any element with text "Read Full Article"
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Check if clicked element is our article link or a child of it
        if (target.matches('.article-link, .read-more') || 
            target.closest('.article-link, .read-more')) {
            
            // Find the actual link element
            const link = target.matches('.article-link, .read-more') ? 
                target : target.closest('.article-link, .read-more');
            
            // Get the URL
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            
            // Prevent default browser behavior
            e.preventDefault();
            e.stopPropagation();
            
            // Open the link
            console.log('Global handler opening link:', href);
            window.open(href, '_blank', 'noopener,noreferrer');
            return false;
        }
    }, true);
    
    // Add additional handler for specific IDs
    document.addEventListener('DOMContentLoaded', function() {
        const webDevArticle = document.getElementById('webDevArticle');
        const iotArticle = document.getElementById('iotArticle');
        
        if (webDevArticle) {
            webDevArticle.style.cursor = 'pointer';
            webDevArticle.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://www.geeksforgeeks.org/future-of-web-development/', '_blank', 'noopener,noreferrer');
                console.log('Direct handler opened webDevArticle');
                return false;
            });
        }
        
        if (iotArticle) {
            iotArticle.style.cursor = 'pointer';
            iotArticle.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://www.techtarget.com/iotagenda/definition/smart-city', '_blank', 'noopener,noreferrer');
                console.log('Direct handler opened iotArticle');
                return false;
            });
        }
    });
} 