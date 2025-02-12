// Global variables
let tokens = [];
let currentIndex = 0;
let intervalId;
let isRunning = false;

// DOM elements
const tokenStreamEl = document.getElementById("tokenStream");
const speedInput = document.getElementById("speed");
const presetSelect = document.getElementById("presetSpeed");
const toggleButton = document.getElementById("toggleButton");
const resetButton = document.getElementById("resetButton");
const cursorEl = document.createElement('span');
cursorEl.className = 'cursor';
cursorEl.style.display = 'none'; // Initially hide cursor
tokenStreamEl.appendChild(cursorEl);

// Create placeholder text element
const placeholderEl = document.createElement('span');
placeholderEl.className = 'placeholder-text';
placeholderEl.textContent = "Press 'Start' to begin visualizing token streaming speeds...";
tokenStreamEl.insertBefore(placeholderEl, cursorEl);

// Function to parse and validate speed from URL parameters
function getSpeedFromURL() {
  const params = new URLSearchParams(window.location.search);
  const speedParam = params.get('speed');

  if (speedParam === null) return null;

  // Convert to float and validate
  const speed = parseFloat(speedParam);

  // Check if speed is a valid number and within acceptable range
  if (!isNaN(speed) && speed >= 0.01 && speed <= 1000000) {
    return speed;
  }

  return null;
}

// Initialize page with URL parameters
function initializeWithURLParams() {
  const speed = getSpeedFromURL();
  if (speed !== null) {
    speedInput.value = speed;
    presetSelect.value = ""; // Reset preset selection
    startStreaming(); // Auto-start streaming
  }
}

// Fetch tokens and initialize
fetch("output.json")
  .then(response => response.json())
  .then(data => {
    tokens = data;
    initializeWithURLParams(); // Initialize after tokens are loaded
  })
  .catch(error => {
    console.error("Error loading tokens:", error);
    tokens = ["You", " will", " rejoice", " to", " hear", " that", " no", " disaster", " has", " accompanied"];
    initializeWithURLParams(); // Initialize even if token loading fails
  });

function streamToken() {
  if (currentIndex < tokens.length) {
    const tokensPerSecond = parseFloat(speedInput.value) || 5;

    if (tokensPerSecond >= 60) {
      // For high speeds, process multiple tokens per tick
      const batchSize = Math.max(1, Math.floor(tokensPerSecond / 60));
      for (let i = 0; i < batchSize && currentIndex < tokens.length; i++) {
        const tokenNode = document.createTextNode(tokens[currentIndex]);
        tokenStreamEl.insertBefore(tokenNode, cursorEl);
        currentIndex++;
      }
    } else {
      // For slower speeds, only process a token if enough time has passed
      const tokenNode = document.createTextNode(tokens[currentIndex]);
      tokenStreamEl.insertBefore(tokenNode, cursorEl);
      currentIndex++;
    }

    // Smooth auto-scroll
    cursorEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
  } else {
    stopStreaming();
    toggleButton.textContent = "Start";
    cursorEl.style.display = 'none'; // Hide cursor when done
  }
}

function startStreaming() {
  if (!isRunning) {
    // Remove placeholder when streaming starts
    if (placeholderEl.parentNode === tokenStreamEl) {
      tokenStreamEl.removeChild(placeholderEl);
    }
    cursorEl.style.display = 'inline-block'; // Show cursor when streaming starts
    const tokensPerSecond = parseFloat(speedInput.value) || 5;

    // For speeds < 60/second, use regular interval timing
    // For speeds >= 60/second, use 60Hz refresh rate
    const intervalTime = tokensPerSecond >= 60 ? (1000 / 60) : (1000 / tokensPerSecond);

    intervalId = setInterval(streamToken, intervalTime);
    isRunning = true;
    toggleButton.textContent = "Stop";
  }
}

function stopStreaming() {
  if (isRunning) {
    clearInterval(intervalId);
    isRunning = false;
    toggleButton.textContent = (currentIndex < tokens.length) ? "Continue" : "Start";
  }
}

// Add this new function to update URL
function updateURLSpeed(speed) {
  const url = new URL(window.location);
  if (speed) {
    url.searchParams.set('speed', speed);
  } else {
    url.searchParams.delete('speed');
  }
  window.history.replaceState({}, '', url);
}

// Event Listeners
toggleButton.addEventListener("click", () => {
  if (isRunning) {
    stopStreaming();
  } else {
    startStreaming();
  }
});

resetButton.addEventListener("click", () => {
  stopStreaming();
  currentIndex = 0;
  // Remove all nodes except the cursor
  while (tokenStreamEl.firstChild !== cursorEl) {
    tokenStreamEl.removeChild(tokenStreamEl.firstChild);
  }
  // Add placeholder text back
  tokenStreamEl.insertBefore(placeholderEl, cursorEl);
  cursorEl.style.display = 'none'; // Hide cursor on reset
  toggleButton.textContent = "Start";
  updateURLSpeed(null);
});

presetSelect.addEventListener("change", () => {
  const presetValue = presetSelect.value;
  if (presetValue !== "") {
    speedInput.value = presetValue;
    updateURLSpeed(presetValue);
    stopStreaming();
    currentIndex = 0;
    // Remove all nodes except the cursor
    while (tokenStreamEl.firstChild !== cursorEl) {
      tokenStreamEl.removeChild(tokenStreamEl.firstChild);
    }
    startStreaming();
  }
});

speedInput.addEventListener("input", () => {
  presetSelect.value = "";
  const speed = parseFloat(speedInput.value);
  if (!isNaN(speed)) {
    updateURLSpeed(speed); // Update URL with new speed
  }
  if (isRunning) {
    clearInterval(intervalId);
    const tokensPerSecond = speed || 5;
    const intervalTime = tokensPerSecond >= 60 ? (1000 / 60) : (1000 / tokensPerSecond);
    intervalId = setInterval(streamToken, intervalTime);
  }
});

speedInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const speed = parseFloat(speedInput.value);
    if (!isNaN(speed)) {
      updateURLSpeed(speed);
    }
    stopStreaming();
    currentIndex = 0;
    // Remove all nodes except the cursor
    while (tokenStreamEl.firstChild !== cursorEl) {
      tokenStreamEl.removeChild(tokenStreamEl.firstChild);
    }
    startStreaming();
  }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    toggleButton.click();
  } else if (e.code === 'KeyR') {
    e.preventDefault();
    resetButton.click();
  }
});