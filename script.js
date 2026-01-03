// Professional Business Website JavaScript for Sinkhwal Services
// Includes particle system, service modals, and WhatsApp integration

// Wait for DOM to load before initializing
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initServiceSystem();
    initScrollEffects();
    initScrollIndicator();
    initTestimonialCarousel();
    initFAQAccordion();
});

// Particle System (maintained for professional tech aesthetic)
function initParticles() {
    const canvas = document.querySelector('.particles');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    console.log('Particle system initialized:', canvas.width, 'x', canvas.height);

    const particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.8 - 0.4; // Slower, more professional movement
            this.speedY = Math.random() * 0.8 - 0.4;
            this.opacity = 0;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += 0.008; // Slower fade-in
            if (this.opacity > 1) this.opacity = 1;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.opacity = 0;
            }
        }
        draw() {
            // Professional glow effect
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(37, 99, 235, 0.4)'; // Professional blue glow
            
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.7})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
        }
    }

    function init() {
        particles.length = 0;
        for (let i = 0; i < 80; i++) { // Fewer particles for professional look
            particles.push(new Particle());
        }
        console.log('Particles initialized:', particles.length);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
    
    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log('Canvas resized:', canvas.width, 'x', canvas.height);
    });
}

// Initialize scroll indicator
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        if (scrolled > maxScroll * 0.8) {
            indicator.style.opacity = '0';
        } else {
            indicator.style.opacity = '0.3';
        }
    });
}

// Service System Initialization
function initServiceSystem() {
    console.log('Service system initialized');
    // Add any service-specific initialization here
}

// Scroll Effects
function initScrollEffects() {
    // Smooth scrolling for navigation
    window.scrollToServices = function() {
        document.getElementById('services-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    window.scrollToContact = function() {
        document.getElementById('contact-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    };
}

// WhatsApp Business Integration
function contactWhatsApp(serviceType) {
    const phoneNumber = '9779869131707'; // Your WhatsApp Business number
    const baseUrl = `https://wa.me/${phoneNumber}`;
    
    const messages = {
        'general': `Hello! I'm interested in learning more about Sinkhwal Services and your digital solutions. Could we schedule a consultation?`,
        
        'web-development': `Hi! I'm interested in your Web Development services. I'd like to discuss building a custom web application/website. Could you provide more details about your process and pricing?`,
        
        'school-management': `Hi! I'm interested in your School Management System (School360). We need a complete solution for student management and fee collection. Can we discuss our requirements?`,
        
        'consultation': `Hello! I'd like to schedule a free consultation to discuss how Sinkhwal Services can help transform our business with digital solutions. When would be a good time to talk?`
    };
    
    const message = messages[serviceType] || messages['general'];
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${baseUrl}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Track the interaction (for analytics if needed)
    console.log(`WhatsApp contact initiated for: ${serviceType}`);
}

// Service Details Modal System
function openServiceDetails(serviceId) {
    const serviceData = {
        'web-development': {
            title: 'Web Development Services',
            icon: '🌐',
            description: 'Transform your business with custom web applications and responsive websites built using modern technologies and best practices.',
            
            features: [
                'Custom Web Application Development - Tailored solutions for your specific business needs',
                'Responsive Website Design - Perfect display on all devices and screen sizes',
                'E-commerce Solutions - Complete online stores with payment integration',
                'Content Management Systems - Easy-to-use admin panels for content updates',
                'API Development & Integration - Connect your systems and third-party services',
                'Performance Optimization - Fast loading times and smooth user experience',
                'SEO Implementation - Built-in search engine optimization for better visibility',
                'Security & Maintenance - Ongoing support and security updates'
            ],
            
            technologies: ['HTML5/CSS3', 'JavaScript/TypeScript', 'React/Angular/Vue', 'Node.js', 'ASP.NET Core', 'Database Design', 'Cloud Deployment'],
            
            process: [
                '1. Requirements Analysis - Understanding your business needs and goals',
                '2. Design & Planning - Creating wireframes and technical specifications',
                '3. Development - Building your solution with regular progress updates',
                '4. Testing & Quality Assurance - Thorough testing across all devices',
                '5. Deployment & Launch - Going live with full support',
                '6. Maintenance & Support - Ongoing updates and technical support'
            ],
            
            pricing: 'Starting from NPR 15,000 for basic websites. Custom applications quoted based on requirements.',
            timeline: '2-8 weeks depending on project complexity'
        },
        
        'bdr-blood-registry': {
            title: 'BDR - Blood Donor Registry',
            icon: '🩸',
            description: 'Free public platform connecting blood donors with those in need during emergencies. A life-saving digital service with privacy protection and instant access.',
            
            features: [
                'Emergency Blood Search - Find available donors instantly by blood group and location',
                'Completely Free Service - No charges or hidden fees, purely a public service',
                'Privacy Protected Registration - Information shared only with consent for emergencies',
                'Quick Access System - Instant donor search and contact during critical situations',
                'Direct Contact via Phone/WhatsApp - Immediate communication with available donors',
                'Location-Based Search - Find donors in your specific area or nearby locations',
                'Availability Control - Donors can update their availability status anytime',
                'Secure Data Management - Encrypted storage with privacy protection'
            ],
            
            technologies: ['Emergency Response System', 'Location Services', 'Privacy Protection', 'Real-time Communication', 'Public Health Service', 'Database Management'],
            
            impact: [
                '🩸 Connect donors with emergency blood needs instantly',
                '🆓 Completely free public service - no hidden costs',
                '🔒 Privacy-first approach with consent-based sharing',
                '⚡ Quick response during medical emergencies',
                '📱 Direct communication via phone and WhatsApp',
                '🌍 Location-based donor matching for faster access'
            ],
            
            liveUrl: 'https://bdr.sinkhwalservices.com.np',
            pricing: 'Completely Free Public Service',
            timeline: 'Instant access - register and start helping save lives'
        },
        
        'school-management': {
            title: 'School Management Systems (School360)',
            icon: '🏫',
            description: 'Complete digital transformation for educational institutions. Our flagship School360 system replaces manual processes with efficient digital solutions.',
            
            features: [
                'Student Information Management - Complete digital student profiles and records',
                'Automated Fee Collection - Smart fee calculation and payment tracking',
                'Digital Bill Generation - Professional invoices and receipts',
                'Attendance Management - Digital attendance tracking and reporting',
                'Grade Management - Online gradebooks and report cards',
                'Parent Communication - Automated notifications and updates',
                'Staff Management - Employee records and payroll integration',
                'Financial Reporting - Comprehensive financial analytics and reports',
                'Multi-user Access - Role-based permissions for different users',
                'Mobile-Friendly Interface - Access from any device, anywhere'
            ],
            
            modules: [
                '👥 Student Management Module',
                '💰 Fee Collection & Billing',
                '📚 Academic Management',
                '👨‍🏫 Staff & Teacher Portal',
                '👨‍👩‍👧‍👦 Parent Communication Portal',
                '📊 Reports & Analytics Dashboard',
                '🔐 Security & User Management',
                '📱 Mobile Application'
            ],
            
            benefits: [
                '📋 Replace manual ledger books with digital records',
                '⚡ Reduce administrative workload by 70%',
                '💡 Eliminate calculation errors in fee management',
                '📞 Improve parent-school communication',
                '📈 Better financial tracking and reporting',
                '🔒 Secure data storage and backup'
            ],
            
            liveDemo: 'https://school360.nabinsinkhwal.com.np',
            pricing: 'Starting from NPR 1,50,000 for complete system. Customization available.',
            timeline: '4-12 weeks for full implementation including training'
        }
    };
    
    const service = serviceData[serviceId];
    if (!service) return;
    
    const modal = document.getElementById('serviceModal');
    const content = document.getElementById('serviceDetails');
    
    let modalHTML = `
        <div class="service-header">
            <div class="service-modal-icon">${service.icon}</div>
            <h2>${service.title}</h2>
            <p class="service-modal-description">${service.description}</p>
            </div>
    `;
    
    // Features section
    if (service.features) {
        modalHTML += `
            <div class="modal-section">
                <h3>Key Features & Capabilities</h3>
                <ul class="feature-list">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                </div>
        `;
    }
    
    // Technologies section
    if (service.technologies) {
        modalHTML += `
            <div class="modal-section">
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    ${service.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
    `;
}

    // Process section (for web development)
    if (service.process) {
        modalHTML += `
            <div class="modal-section">
                <h3>Our Development Process</h3>
                <ul class="process-list">
                    ${service.process.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Benefits section (for automation)
    if (service.benefits) {
        modalHTML += `
            <div class="modal-section">
                <h3>Business Benefits</h3>
                <ul class="benefits-list">
                    ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Modules section (for school management)
    if (service.modules) {
        modalHTML += `
            <div class="modal-section">
                <h3>System Modules</h3>
                <div class="modules-grid">
                    ${service.modules.map(module => `<div class="module-item">${module}</div>`).join('')}
            </div>
        </div>
    `;
}

    // Pricing and timeline
    modalHTML += `
        <div class="modal-section pricing-section">
            <div class="pricing-info">
                <h4>💰 Investment</h4>
                <p>${service.pricing}</p>
            </div>
            <div class="timeline-info">
                <h4>⏱️ Timeline</h4>
                <p>${service.timeline}</p>
            </div>
        </div>
    `;
    
    // Live demo link (for school management)
    if (service.liveDemo) {
        modalHTML += `
            <div class="modal-section demo-section">
                <a href="${service.liveDemo}" target="_blank" class="demo-button">
                    🚀 View Live Demo - School360
                </a>
            </div>
        `;
    }
    
    // Call to action buttons
    modalHTML += `
        <div class="modal-actions">
            <button class="modal-cta primary" onclick="contactWhatsApp('${serviceId}')">
                💬 Get Detailed Quote
            </button>
            <button class="modal-cta secondary" onclick="contactWhatsApp('consultation')">
                📞 Schedule Consultation
            </button>
        </div>
    `;
    
    content.innerHTML = modalHTML;
    modal.style.display = 'block';
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore body scroll
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const serviceModal = document.getElementById('serviceModal');
    
    if (event.target === serviceModal) {
        closeServiceModal();
    }
}

// Professional animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in-up');
    });
    
    // Add hover effects to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .service-cta, .contact-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Smooth scroll behavior for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Testimonial Carousel Functionality
let currentTestimonialIndex = 0;
let testimonials = [];
let dots = [];

function initTestimonialCarousel() {
    // Re-select elements after DOM is loaded
    testimonials = document.querySelectorAll('.testimonial-card');
    dots = document.querySelectorAll('.dot');
    
    if (testimonials.length === 0) return;
    
    // Initialize first testimonial as active
    showTestimonial(currentTestimonialIndex);
    
    // Auto-rotate testimonials every 5 seconds
    setInterval(function() {
        changeTestimonial(1);
    }, 5000);
}

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current testimonial
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
    }
    
    // Activate current dot
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

function changeTestimonial(direction) {
    currentTestimonialIndex += direction;
    
    if (currentTestimonialIndex >= testimonials.length) {
        currentTestimonialIndex = 0;
    } else if (currentTestimonialIndex < 0) {
        currentTestimonialIndex = testimonials.length - 1;
    }
    
    showTestimonial(currentTestimonialIndex);
}

function currentTestimonial(index) {
    currentTestimonialIndex = index - 1;
    showTestimonial(currentTestimonialIndex);
}

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const isActive = element.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
        const qAnswer = q.nextElementSibling;
        if (qAnswer) {
            qAnswer.classList.remove('active');
        }
    });
    
    // Toggle current item
    if (!isActive && answer) {
        element.classList.add('active');
        answer.classList.add('active');
        console.log('FAQ opened:', element.textContent.trim());
    } else {
        console.log('FAQ closed');
    }
}

console.log('Sinkhwal Services website initialized successfully!');