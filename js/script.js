/* NYC Foot Dr — Premium Interactive Logic & Live Assistant Chat */
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Page Loader Handler
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('fade-out');
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 500);
    }, 1500);
  }

  // 2. Sticky Navbar Effect
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 3. Stat Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const prefix = stat.getAttribute('data-prefix') || '';
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = Math.ceil(target / 45);

      const updateCount = () => {
        count += speed;
        if (count >= target) {
          stat.innerText = prefix + target.toLocaleString() + suffix;
        } else {
          stat.innerText = prefix + count.toLocaleString() + suffix;
          setTimeout(updateCount, 30);
        }
      };
      updateCount();
    });
  }

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          animateCounters();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(statsSection);
  }

  // 4. Interactive Service Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 5. Appointment Form Validation & Submission in Modal
  const bookingForm = document.getElementById('appointmentForm');
  const bookingSuccessBox = document.getElementById('bookingSuccessBox');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (bookingForm.checkValidity()) {
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> Submitting Request...`;

        setTimeout(() => {
          bookingForm.style.display = 'none';
          if (bookingSuccessBox) {
            bookingSuccessBox.style.display = 'block';
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }, 1200);
      } else {
        bookingForm.classList.add('was-validated');
      }
    });

    const appointmentModal = document.getElementById('appointmentModal');
    if (appointmentModal) {
      appointmentModal.addEventListener('hidden.bs.modal', () => {
        if (bookingForm) {
          bookingForm.reset();
          bookingForm.style.display = 'block';
          bookingForm.classList.remove('was-validated');
        }
        if (bookingSuccessBox) {
          bookingSuccessBox.style.display = 'none';
        }
      });
    }
  }

  // 6. Interactive Live Assistant Chat Engine
  const assistantTrigger = document.getElementById('assistantTrigger');
  const assistantWindow = document.getElementById('assistantWindow');
  const assistantClose = document.getElementById('assistantClose');
  const chatBody = document.getElementById('chatBody');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');

  if (assistantTrigger && assistantWindow) {
    assistantTrigger.addEventListener('click', () => {
      assistantWindow.classList.toggle('active');
      if (assistantWindow.classList.contains('active') && chatInput) {
        chatInput.focus();
      }
    });
  }

  if (assistantClose && assistantWindow) {
    assistantClose.addEventListener('click', () => {
      assistantWindow.classList.remove('active');
    });
  }

  const botAnswers = {
    'services': "Dr. Sapna Pandya, DPM specializes in Diabetic Foot Ulcers, Venous & Arterial Leg Ulcers, Surgical Wounds, Burn Care, Post-Amputation Wound Care, Circulation Issues, Biologics, and General Podiatry.",
    'hours': "Our NYC clinic is open Monday – Friday: 8:30 AM – 5:30 PM. Urgent wound care openings are available weekly!",
    'appointment': "You can easily schedule a visit! Click the 'Book Appointment' button below or call our staff directly at 646-991-9000.",
    'location': "NYC Foot Dr is located in New York City, NY. Check our location section on the homepage for exact directions!",
    'insurance': "We accept Medicare and most major PPO/HMO commercial health insurance plans. Call 646-991-9000 to confirm your plan."
  };

  // Quick Reply Buttons Click Event
  quickReplyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const queryKey = btn.getAttribute('data-query');
      const questionText = btn.innerText;

      appendChatMessage(questionText, 'user');

      setTimeout(() => {
        const answerText = botAnswers[queryKey] || "Thank you for reaching out! You can call us anytime at 646-991-9000 or 894186796 for immediate help.";
        appendChatMessage(answerText, 'bot');
      }, 400);
    });
  });

  // Custom User Live Chat Input Submit Event
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;

      // Add user message to chat UI
      appendChatMessage(userText, 'user');
      chatInput.value = '';

      // Generate Smart Bot Response based on user keywords
      setTimeout(() => {
        const botReply = generateSmartBotReply(userText);
        appendChatMessage(botReply, 'bot');
      }, 500);
    });
  }

  function generateSmartBotReply(input) {
    const text = input.toLowerCase();

    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return "Hello! How can Dr. Sapna Pandya's team assist your foot or wound care needs today?";
    }
    if (text.includes('book') || text.includes('appointment') || text.includes('schedule') || text.includes('visit')) {
      return "You can easily request an appointment! Click 'Book Appointment' at the top of the page or call 646-991-9000.";
    }
    if (text.includes('phone') || text.includes('call') || text.includes('number') || text.includes('contact')) {
      return "Our office numbers are: Main: 646-991-9000 | Secondary: 894186796 | WhatsApp: 646-991-9000.";
    }
    if (text.includes('hour') || text.includes('open') || text.includes('time') || text.includes('close')) {
      return "Our NYC clinic hours are Monday – Friday: 8:30 AM – 5:30 PM. Emergency on-call support is available on weekends.";
    }
    if (text.includes('location') || text.includes('where') || text.includes('address') || text.includes('map')) {
      return "We are located at NYC Foot Dr: Sapna Pandya, DPM in NYC. Please see the interactive map on our home page for full details!";
    }
    if (text.includes('insurance') || text.includes('medicare') || text.includes('pay') || text.includes('cost')) {
      return "We accept Medicare and most major health insurance plans (PPO/HMO). Contact us at 646-991-9000 to verify your specific coverage.";
    }
    if (text.includes('diabetic') || text.includes('ulcer') || text.includes('wound') || text.includes('burn') || text.includes('surge')) {
      return "Dr. Sapna Pandya, DPM specializes in advanced wound debridement, bio-engineered grafts, diabetic limb salvage, and vascular wound care.";
    }
    if (text.includes('doctor') || text.includes('sapna') || text.includes('pandya')) {
      return "Dr. Sapna Pandya, DPM is a board-certified podiatrist & wound specialist with over 15 years of clinical limb preservation experience in NYC.";
    }

    return "Thank you for your message! Dr. Pandya's staff is available at 646-991-9000 or 894186796. Feel free to ask about our services, hours, or booking an appointment!";
  }

  function appendChatMessage(text, sender) {
    if (!chatBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // 7. Smooth Scroll for internal navigation links
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          }
        }
      }
    });
  });

});
