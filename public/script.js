// Typing animation for roles and descriptions
const greetingText = document.getElementById('greeting');
const typingText = document.getElementById('typing-text');
const descriptionText = document.getElementById('description');
const cursor = document.querySelector('.cursor');

const greeting = "Hey there! I'm Christian C. Francisco";

const roles = [
  {
    text: 'designer',
    class: 'designer',
    description: 'UI/UX Designer with passion for designing beautiful and functional user experiences.'
  },
  {
    text: '<coder>',
    class: 'coder',
    description: 'Full-stack Developer who focuses on writing clean, elegant and efficient code.'
  }
];

let greetingDone = false;
let currentRoleIndex = 0;
let charIndex = 0;
let descCharIndex = 0;
let greetingCharIndex = 0;
let animationPhase = 'typing-greeting'; // 'typing-greeting', 'typing-role', 'typing-desc', 'pausing', 'deleting-desc', 'deleting-role'
let typingSpeed = 80;
let pauseTime = 1500;
let displayedText = '';
let displayedDesc = '';
let displayedGreeting = '';

function typeAnimation() {
  if (animationPhase === 'typing-greeting') {
    if (greetingCharIndex < greeting.length) {
      displayedGreeting += greeting[greetingCharIndex];
      greetingText.textContent = displayedGreeting;
      greetingText.appendChild(cursor);
      greetingCharIndex++;
      setTimeout(typeAnimation, typingSpeed);
    } else {
      // Greeting typing complete
      greetingText.textContent = displayedGreeting;
      greetingDone = true;
      animationPhase = 'typing-role';
      charIndex = 0;
      displayedText = '';
      setTimeout(typeAnimation, 500);
    }
  } else if (animationPhase === 'typing-role') {
    const currentRole = roles[currentRoleIndex];
    const roleText = currentRole.text;
    const descText = currentRole.description;
    
    if (charIndex < roleText.length) {
      displayedText += roleText[charIndex];
      // Update role text with cursor in the h2
      typingText.textContent = displayedText;
      typingText.appendChild(cursor);
      charIndex++;
      setTimeout(typeAnimation, typingSpeed);
    } else {
      // Role typing complete, remove cursor from h2 and move to description
      typingText.textContent = displayedText;
      typingText.className = `role typing ${currentRole.class}`;
      animationPhase = 'typing-desc';
      descCharIndex = 0;
      displayedDesc = '';
      setTimeout(typeAnimation, 300);
    }
  } else if (animationPhase === 'typing-desc') {
    const currentRole = roles[currentRoleIndex];
    const descText = currentRole.description;
    
    if (descCharIndex < descText.length) {
      displayedDesc += descText[descCharIndex];
      // Update description text with cursor in the p
      descriptionText.textContent = displayedDesc;
      descriptionText.appendChild(cursor);
      descCharIndex++;
      setTimeout(typeAnimation, 40);
    } else {
      // Description typing complete, remove cursor and pause
      descriptionText.textContent = displayedDesc;
      animationPhase = 'pausing';
      setTimeout(typeAnimation, pauseTime);
    }
  } else if (animationPhase === 'pausing') {
    // Start deleting description
    animationPhase = 'deleting-desc';
    setTimeout(typeAnimation, 300);
  } else if (animationPhase === 'deleting-desc') {
    if (descCharIndex > 0) {
      displayedDesc = displayedDesc.substring(0, descCharIndex - 1);
      descriptionText.textContent = displayedDesc;
      descriptionText.appendChild(cursor);
      descCharIndex--;
      setTimeout(typeAnimation, 30);
    } else {
      // Description deleted, move cursor back to h2 and delete role
      descriptionText.textContent = '';
      animationPhase = 'deleting-role';
      setTimeout(typeAnimation, 200);
    }
  } else if (animationPhase === 'deleting-role') {
    if (charIndex > 0) {
      displayedText = displayedText.substring(0, charIndex - 1);
      typingText.textContent = displayedText;
      typingText.appendChild(cursor);
      charIndex--;
      setTimeout(typeAnimation, 30);
    } else {
      // All deleted, move to next role
      typingText.textContent = '';
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      animationPhase = 'typing-role';
      charIndex = 0;
      displayedText = '';
      displayedDesc = '';
      setTimeout(typeAnimation, 500);
    }
  }
}

// Start typing animation
typeAnimation();

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Active nav link indicator
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + 100;

  navLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      link.style.color = 'var(--accent)';
    } else {
      link.style.color = 'var(--text-light)';
    }
  });
});

// See all projects button
const seeAllBtn = document.getElementById('see-all-btn');
const hiddenProjects = document.querySelectorAll('.hidden-project');
let showingAll = false;

seeAllBtn.addEventListener('click', () => {
  showingAll = !showingAll;
  hiddenProjects.forEach(project => {
    if (showingAll) {
      project.classList.add('visible');
    } else {
      project.classList.remove('visible');
    }
  });
  seeAllBtn.textContent = showingAll ? 'Show Less' : 'See All Projects';
});

// Theme toggle (dark/light mode)
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
  themeIcon.classList.remove('fa-sun');
  themeIcon.classList.add('fa-moon');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLightMode = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  
  // Update icon
  if (isLightMode) {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  } else {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
});

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();
