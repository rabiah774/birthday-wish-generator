function showSection(sectionId) {
  const sections = document.querySelectorAll("section");
  sections.forEach(section => {
    section.classList.remove("active");

    if (section.id === sectionId) {
      section.classList.add("active");
    }
  });
}
function createConfetti() {
  const container = document.getElementById("confetti-container");
  container.innerHTML = "";

  const colors = [
    "#ff4d6d", "#ff6b9d", "#ffd166", "#ffb347", "#06d6a0",
    "#00e5a0", "#4dabf7", "#748ffc", "#c77dff", "#da77f2",
    "#ff8fab", "#ffc078", "#69db7c", "#66d9e8", "#ffd700",
    "#e8daef"
  ];
  const shapes = ["rect", "circle", "star", "ribbon", "diamond"];
  const sizes = ["sm", "md", "md", "lg", "xl"]; // weighted toward medium

  function spawnBurst(count, baseDelay) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      el.classList.add("confetti", `confetti--${shape}`, `confetti--${size}`);

      // random horizontal position
      el.style.left = Math.random() * 100 + "%";

      // color (stars get set via background for clip-path visibility)
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.backgroundColor = color;
      if (shape === "star") {
        el.style.setProperty("background", color, "important");
      }

      // random sway direction & magnitude
      const sway = (Math.random() - 0.5) * 120; // -60px to +60px
      el.style.setProperty("--sway", sway + "px");

      // staggered delay within the burst
      const delay = baseDelay + Math.random() * 0.6;
      el.style.setProperty("--fall-delay", delay + "s");

      // slight random duration variation
      const baseDur = parseFloat(getComputedStyle(el).getPropertyValue("--fall-duration") || "3");
      el.style.setProperty("--fall-duration", (baseDur + Math.random() * 1.2) + "s");

      container.appendChild(el);
    }
  }

  // Three staggered bursts for a dramatic cascade
  spawnBurst(60, 0);       // immediate burst
  spawnBurst(40, 0.4);     // second wave
  spawnBurst(30, 0.9);     // trailing sparkle

  // Cleanup after all animations finish
  setTimeout(() => {
    container.innerHTML = "";
  }, 6000);
}

// ── Image upload preview ──
let uploadedImageDataURL = null;

const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");

photoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageDataURL = e.target.result;
      photoPreview.innerHTML =
        `<img src="${uploadedImageDataURL}" alt="Preview">` +
        `<span class="preview-label"><span class="preview-icon">✅</span>Image selected — ${file.name}</span>`;
      photoPreview.classList.add("has-image");
    };
    reader.readAsDataURL(file);
  } else {
    // Reset if no valid image
    photoPreview.innerHTML = "";
    photoPreview.classList.remove("has-image");
    uploadedImageDataURL = null;
  }
});

const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const age = Number(params.get("age"));
const from = params.get("from");
const urlMessage = params.get("message");


// If parameters are present, show intro section
if (name && age && from) {

  document.getElementById("introName").textContent = name;
  document.getElementById("introAge").textContent = age;
  document.getElementById("introFrom").textContent = from;

  showSection("intro-section");
}

const celebrationButton = document.getElementById("startCelebrationButton");
celebrationButton.addEventListener("click", function (e) {
  e.preventDefault();

  showSection("gift-section");
});

const giftBox = document.getElementById("giftBox");

giftBox.addEventListener("click", () => {
  createConfetti();

  // small delay before final section
  setTimeout(() => {
    showSection("final-section");

    // Populate the letter with names from URL params
    const recipientName = document.getElementById("recipientName");
    const senderName = document.getElementById("senderName");
    const letterRecipient = document.getElementById("letterRecipient");
    const letterSender = document.getElementById("letterSender");

    if (recipientName) recipientName.textContent = name || "Friend";
    if (senderName) senderName.textContent = from || "Your Friend";
    if (letterRecipient) letterRecipient.textContent = name || "Friend";
    if (letterSender) letterSender.textContent = from || "Your Friend";

    // ── Show uploaded photo in letter ──
    const letterPhotoFrame = document.getElementById("letterPhotoFrame");
    const letterPhoto = document.getElementById("letterPhoto");
    if (uploadedImageDataURL && letterPhotoFrame && letterPhoto) {
      letterPhoto.src = uploadedImageDataURL;
      letterPhotoFrame.style.display = "block";
    }

    // ── Show custom message in letter ──
    const letterMessage = document.getElementById("letterMessage");
    const letterDefaultMsg1 = document.getElementById("letterDefaultMsg1");
    const customMsg = urlMessage || (window._customMessage);
    if (customMsg && customMsg.trim() !== "") {
      if (letterMessage) letterMessage.textContent = customMsg;
      if (letterDefaultMsg1) letterDefaultMsg1.style.display = "none";
    }

    // Show the "Open Letter" button
    const openLetterBtn = document.getElementById("openLetter");
    if (openLetterBtn) {
      openLetterBtn.style.display = "inline-flex";
    }
  }, 1500);
});

// ── Open Letter Button Logic ──
const openLetterBtn = document.getElementById("openLetter");
if (openLetterBtn) {
  openLetterBtn.addEventListener("click", function () {
    const letterContainer = document.getElementById("letterContainer");
    if (letterContainer) {
      letterContainer.classList.remove("hidden");
    }
    // Hide the "Open Letter" button after clicking
    openLetterBtn.style.display = "none";

  });
}


const form = document.getElementById("form");
const shareLink = document.getElementById("shareLink");
const linkBox = document.getElementById("linkBox");
const copyBtn = document.getElementById("copyBtn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("name").value.trim();
  const age = Number(document.getElementById("age").value);
  const from = document.getElementById("from").value.trim();
  const customMessage = document.getElementById("message").value.trim();

  // Store custom message globally so the gift flow can use it
  window._customMessage = customMessage;

  if (username === "" || age <= 0) {
    alert("Please enter valid details.");
    return;
  }

  const shareText = document.getElementById("shareText").textContent = `Share this link to wish ${username} a happy ${age}th birthday 🎉`;

  // Generate link
  let link =
    `${window.location.origin}${window.location.pathname}` +
    `?name=${encodeURIComponent(username)}` +
    `&age=${age}` +
    `&from=${encodeURIComponent(from)}`;

  if (customMessage) {
    link += `&message=${encodeURIComponent(customMessage)}`;
  }

  shareLink.value = link;
  linkBox.style.display = "block";
});

// ✅ Copy link
copyBtn.addEventListener("click", function () {
  const shareLink = document.getElementById("shareLink");
  shareLink.select();
  shareLink.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard.writeText(shareLink.value);
  alert("Link copied! Share it 🎉");
});
