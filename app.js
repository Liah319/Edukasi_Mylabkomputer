/**
 * ====================================================================
 * EDUKIDS - MAIN JAVASCRIPT APPLICATION (UAS Pemrograman Web I)
 * Interactivity: Hardware Explorer, TTS Voice, Quiz Game, Certificate
 * Canvas Generator, Dynamic Form & LocalStorage Guestbook Wall.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDeviceExplorer();
  initQuiz();
  initFunMascotGreeting();
});

// ==========================================
// 1. NAVBAR & SMOOTH SCROLLING
// ==========================================
function initNavbar() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      window.EduAudio.playPop();
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // Header shadow on scroll
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ==========================================
// 2. DEVICE EXPLORER (SOUNDBOARD & MODAL)
// ==========================================
const devicesData = {
  monitor: {
    name: 'Monitor (Layar Kaca)',
    category: 'Perangkat Keluaran (Output)',
    icon: 'assets/images/monitor.jpg',
    desc: 'Monitor seperti televisi kecil! Fungsinya untuk melihat gambar kartun, video belajar, mewarnai, dan membaca tulisan yang ada di komputer.',
    funFact: '🌟 Tips Sehat: Jaga jarak matamu minimal 50 cm dari layar ya!',
    speechText: 'Ini adalah Monitor. Monitor berguna seperti televisi kecil untuk melihat gambar kartun, video, dan tulisan yang ada di komputer!'
  },
  cpu: {
    name: 'CPU (Otak Komputer)',
    category: 'Perangkat Pemroses (Processor)',
    icon: 'assets/images/cpu.jpg',
    desc: 'CPU adalah kotak pintar yang menjadi otak komputer. Semua perintah seperti membuka game dan memutar lagu diatur oleh CPU.',
    funFact: '⚡ Fakta Unik: Di dalam CPU ada lampu kecil dan kipas pendingin agar komputernya tidak kepanasan!',
    speechText: 'Ini adalah CPU, otaknya komputer! CPU yang mengatur semua tugas pintar, memutar lagu, dan membuka permainan seru!'
  },
  keyboard: {
    name: 'Keyboard (Papan Ketik Ajaib)',
    category: 'Perangkat Masukan (Input)',
    icon: 'assets/images/keyboard.jpg',
    desc: 'Keyboard memiliki banyak tombol huruf dari A sampai Z, angka 0 sampai 9, dan tombol spasi panjang untuk mengetik namamu.',
    funFact: '⌨️ Tombol paling panjang di bawah namanya tombol Space (Spasi) untuk memberi jarak huruf!',
    speechText: 'Ini adalah Keyboard atau papan ketik ajaib. Isinya ada tombol huruf A sampai Z dan angka untuk menulis namamu di komputer!'
  },
  mouse: {
    name: 'Mouse (Tikus Pintar)',
    category: 'Perangkat Masukan (Input)',
    icon: 'assets/images/mouse.jpg',
    desc: 'Mouse dipegang dengan tanganmu untuk menggerakkan panah (kursor) di layar. Ada tombol klik kiri, klik kanan, dan roda putar di tengah.',
    funFact: '🐭 Dinamakan mouse karena bentuknya mungil dan punya kabel yang mirip seperti ekor tikus!',
    speechText: 'Ini adalah Mouse si tikus pintar! Kamu bisa menggerakkan panah di layar dan meng-klik gambar yang kamu suka!'
  },
  speaker: {
    name: 'Speaker (Pengeras Suara)',
    category: 'Perangkat Keluaran (Output)',
    icon: 'assets/images/speaker.jpg',
    desc: 'Speaker mengeluarkan suara yang jernih! Kamu bisa mendengarkan lagu anak-anak, suara hewan, dan dongeng kesukaanmu.',
    funFact: '🎵 Jangan menyetel suara terlalu keras ya teman-teman, agar telinga tetap sehat!',
    speechText: 'Ini adalah Speaker pengeras suara. Dengarkan musik ceria, dongeng seru, dan suara hewan yang asyik dari speaker!'
  },
  printer: {
    name: 'Printer (Mesin Cetak Gambar)',
    category: 'Perangkat Keluaran (Output)',
    icon: 'assets/images/printer.jpg',
    desc: 'Printer berguna untuk mencetak gambarmu yang ada di komputer ke selembar kertas putih asli! Hasil gambarmu bisa diwarnai bersama.',
    funFact: '🖨️ Printer menggunakan tinta warna-warni yang indah seperti pelangi!',
    speechText: 'Ini adalah Printer, mesin pencetak gambar ajaib. Gambar buatanmu di komputer bisa dicetak ke kertas sungguhan!'
  },
  headphones: {
    name: 'Headphones (Penyumbat Suara Asyik)',
    category: 'Perangkat Audio Pribadi',
    icon: 'assets/images/headphones.jpg',
    desc: 'Dipasang di kepala dan telinga agar kamu bisa mendengarkan pelajaran komputer tanpa mengganggu teman di sebelahmu.',
    funFact: '🎧 Bantalan telinganya lembut dan nyaman seperti kapas!',
    speechText: 'Ini adalah Headphones! Pasang di kepala untuk mendengarkan suara yang jernih tanpa mengganggu teman di sekitarmu.'
  }
};

function initDeviceExplorer() {
  const cards = document.querySelectorAll('.device-card');
  const modal = document.getElementById('device-modal');
  const modalClose = document.getElementById('modal-close');
  const modalVoiceBtn = document.getElementById('modal-voice-btn');

  let currentDeviceKey = null;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-device');
      if (devicesData[key]) {
        currentDeviceKey = key;
        openDeviceModal(devicesData[key]);
      }
    });

    // Voice button on card
    const cardVoiceBtn = card.querySelector('.btn-voice-card');
    if (cardVoiceBtn) {
      cardVoiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = card.getAttribute('data-device');
        if (devicesData[key]) {
          window.EduAudio.playPop();
          window.EduAudio.speakText(devicesData[key].speechText);
        }
      });
    }
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      window.EduAudio.playPop();
      modal.classList.remove('active');
      window.EduAudio.stopSpeaking();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        window.EduAudio.stopSpeaking();
      }
    });
  }

  if (modalVoiceBtn) {
    modalVoiceBtn.addEventListener('click', () => {
      if (currentDeviceKey && devicesData[currentDeviceKey]) {
        window.EduAudio.playPop();
        window.EduAudio.speakText(devicesData[currentDeviceKey].speechText);
      }
    });
  }
}

function openDeviceModal(device) {
  window.EduAudio.playPop();
  document.getElementById('modal-device-img').src = device.icon;
  document.getElementById('modal-device-img').alt = device.name;
  document.getElementById('modal-device-title').innerText = device.name;
  document.getElementById('modal-device-category').innerText = device.category;
  document.getElementById('modal-device-desc').innerText = device.desc;
  document.getElementById('modal-device-fact').innerText = device.funFact;

  const modal = document.getElementById('device-modal');
  modal.classList.add('active');

  // Automatically read to kids on open
  window.EduAudio.speakText(device.speechText);
}

// ==========================================
// 3. KUIS INTERAKTIF ANAK PINTAR
// ==========================================
const quizQuestions = [
  {
    question: '1. Benda mana yang bentuknya seperti televisi dan untuk melihat gambar di komputer?',
    image: 'assets/images/monitor.jpg',
    audioPrompt: 'Soal nomor satu. Benda mana yang bentuknya seperti televisi dan untuk melihat gambar?',
    options: [
      { text: 'A. Monitor', correct: true },
      { text: 'B. Keyboard', correct: false },
      { text: 'C. Sepatu', correct: false }
    ],
    hint: 'Layar kaca yang menampilkan kartun kesukaanmu!'
  },
  {
    question: '2. Perangkat mana yang dipegang tangan untuk mengklik dan menggerakkan panah?',
    image: 'assets/images/mouse.jpg',
    audioPrompt: 'Soal nomor dua. Perangkat mana yang dipegang tangan untuk mengklik dan menggerakkan panah?',
    options: [
      { text: 'A. Sapu Tangan', correct: false },
      { text: 'B. Mouse (Tikus)', correct: true },
      { text: 'C. Botol Minum', correct: false }
    ],
    hint: 'Bentuknya mungil seperti tikus dan punya tombol klik!'
  },
  {
    question: '3. Siapakah yang disebut sebagai "Otak Pintar" dari komputer?',
    image: 'assets/images/cpu.jpg',
    audioPrompt: 'Soal nomor tiga. Siapakah yang disebut sebagai Otak Pintar dari komputer?',
    options: [
      { text: 'A. Meja Belajar', correct: false },
      { text: 'B. Piring Makan', correct: false },
      { text: 'C. CPU', correct: true }
    ],
    hint: 'Kotak tempat mesin komputer berpikir!'
  },
  {
    question: '4. Benda apakah yang penuh tombol huruf dan angka untuk mengetik namamu?',
    image: 'assets/images/keyboard.jpg',
    audioPrompt: 'Soal nomor empat. Benda apakah yang penuh tombol huruf dan angka untuk mengetik namamu?',
    options: [
      { text: 'A. Keyboard', correct: true },
      { text: 'B. Pintu Rumah', correct: false },
      { text: 'C. Speaker', correct: false }
    ],
    hint: 'Papan ketik yang punya tombol spasi paling panjang!'
  },
  {
    question: '5. Benda apa yang bisa mengeluarkan lagu-lagu anak ceria dan musik merdu?',
    image: 'assets/images/speaker.jpg',
    audioPrompt: 'Soal nomor lima. Benda apa yang bisa mengeluarkan lagu-lagu anak ceria dan musik merdu?',
    options: [
      { text: 'A. Kotak Pensil', correct: false },
      { text: 'B. Speaker', correct: true },
      { text: 'C. Penggaris', correct: false }
    ],
    hint: 'Pengeras suara yang bikin kita bisa bernyanyi bersama!'
  }
];

let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];

function initQuiz() {
  const startBtn = document.getElementById('quiz-start-btn');
  const restartBtn = document.getElementById('quiz-restart-btn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      window.EduAudio.playPop();
      document.getElementById('quiz-intro-card').style.display = 'none';
      document.getElementById('quiz-play-card').style.display = 'block';
      currentQuestionIndex = 0;
      userScore = 0;
      userAnswers = [];
      loadQuestion(0);
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      window.EduAudio.playPop();
      document.getElementById('quiz-result-card').style.display = 'none';
      document.getElementById('quiz-play-card').style.display = 'block';
      currentQuestionIndex = 0;
      userScore = 0;
      userAnswers = [];
      loadQuestion(0);
    });
  }

  // Voice Question Reader
  const quizVoiceBtn = document.getElementById('quiz-voice-btn');
  if (quizVoiceBtn) {
    quizVoiceBtn.addEventListener('click', () => {
      if (quizQuestions[currentQuestionIndex]) {
        window.EduAudio.playPop();
        window.EduAudio.speakText(quizQuestions[currentQuestionIndex].audioPrompt);
      }
    });
  }
}

function loadQuestion(index) {
  const q = quizQuestions[index];
  if (!q) {
    showQuizResult();
    return;
  }

  document.getElementById('quiz-progress-badge').innerText = `Soal ${index + 1} dari ${quizQuestions.length}`;
  document.getElementById('quiz-progress-bar').style.width = `${((index) / quizQuestions.length) * 100}%`;
  document.getElementById('quiz-question-text').innerText = q.question;
  document.getElementById('quiz-question-img').src = q.image;
  document.getElementById('quiz-hint-text').innerText = `💡 Petunjuk: ${q.hint}`;

  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span class="opt-badge">${String.fromCharCode(65 + optIdx)}</span> ${opt.text.replace(/^[A-C]\.\s*/, '')}`;
    
    btn.addEventListener('click', () => {
      handleAnswerSelection(btn, opt.correct, q);
    });
    optionsContainer.appendChild(btn);
  });

  // Read question aloud
  window.EduAudio.speakText(q.audioPrompt);
}

function handleAnswerSelection(selectedBtn, isCorrect, questionObj) {
  // Disable all buttons in container
  const allBtns = document.querySelectorAll('.quiz-option-btn');
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    selectedBtn.classList.add('correct');
    userScore += 20; // 5 questions = 100 max
    window.EduAudio.playCorrect();
    createConfettiEffect(selectedBtn);
  } else {
    selectedBtn.classList.add('wrong');
    window.EduAudio.playWrong();
    // Highlight correct one
    allBtns.forEach(b => {
      if (questionObj.options.some(o => o.correct && b.innerText.includes(o.text.replace(/^[A-C]\.\s*/, '')))) {
        b.classList.add('correct');
      }
    });
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      loadQuestion(currentQuestionIndex);
    } else {
      showQuizResult();
    }
  }, 1600);
}

function showQuizResult() {
  window.EduAudio.playFanfare();
  document.getElementById('quiz-play-card').style.display = 'none';
  document.getElementById('quiz-result-card').style.display = 'block';
  document.getElementById('quiz-progress-bar').style.width = '100%';

  document.getElementById('final-score-number').innerText = userScore;
  
  const starsContainer = document.getElementById('quiz-stars-container');
  let starsHtml = '';
  let praiseText = '';

  if (userScore >= 80) {
    starsHtml = '⭐⭐⭐';
    praiseText = 'Luar Biasa! Kamu Anak Sangat Pintar dan Juara Komputer! 🏆🎉';
  } else if (userScore >= 60) {
    starsHtml = '⭐⭐';
    praiseText = 'Hebat Sekali! Kamu Sudah Mengenal Komputer dengan Baik! 🌟👏';
  } else {
    starsHtml = '⭐';
    praiseText = 'Bagus! Ayo coba lagi dan belajar bersama Robot Kami ya! 💪😊';
  }

  starsContainer.innerHTML = starsHtml;
  document.getElementById('quiz-praise-text').innerText = praiseText;
  window.EduAudio.speakText(`Selamat! Nilai kamu adalah ${userScore}. ${praiseText}`);
}

// ==========================================
// 7. FUN MASCOT GREETING (KOMPI BOT)
// ==========================================
function initFunMascotGreeting() {
  const mascot = document.getElementById('komi-mascot-img');
  if (mascot) {
    mascot.addEventListener('click', () => {
      window.EduAudio.playPop();
      window.EduAudio.speakText('Selamat datang di My Labkomputer – Easy Pizzy Lemon Squizy! Di sini kita akan belajar mengenal komputer dengan cara yang seru, menyenangkan, dan mudah dipahami. Jangan takut ya! Komputer adalah teman yang bisa membantu kita belajar, bermain, dan menggambar!');
    });
  }
}

// Helper: Escape HTML to avoid XSS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Confetti Effect Helper
function createConfettiEffect(targetElem) {
  const rect = targetElem.getBoundingClientRect();
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    confetti.style.left = `${rect.left + rect.width / 2 + (Math.random() * 60 - 30)}px`;
    confetti.style.top = `${rect.top + (Math.random() * 30 - 15)}px`;
    confetti.style.backgroundColor = ['#f6ad55', '#48bb78', '#4299e1', '#fc8181', '#ecc94b', '#9f7aea'][Math.floor(Math.random() * 6)];
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 1200);
  }
}
