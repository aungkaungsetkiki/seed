
    const seedInput = document.getElementById('seedInput');
    const multiplierInput = document.getElementById('multiplierInput');
    const modulusInput = document.getElementById('modulusInput');
    const hisInput = document.getElementById('hisInput');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const predictionResult = document.getElementById('predictionResult');
    const predictionDigits = document.getElementById('predictionDigits');
    const countdownDiv = document.getElementById('countdown');
    const finalResult = document.getElementById('finalResult');
    const manualStartBtn = document.getElementById('manualStartBtn');
    const autoStartBtn = document.getElementById('autoStartBtn');
    const autoStopBtn = document.getElementById('autoStopBtn');
    const statusLed = document.getElementById('statusLed');
    const statusText = document.getElementById('statusText');
    const cycleCount = document.getElementById('cycleCount');
    const cycleCounter = document.getElementById('cycleCounter');

    let countdownInterval = null;
    let totalSeconds = 0;
    let initialTotalSeconds = 0;
    let currentPrediction = [];
    let autoMode = false;
    let cycleNumber = 0;

    function updatePrediction() {
      const seed = seedInput.value;
      const hours = parseInt(hoursInput.value) || 0;
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;
      if (seed.length === 5 && /^\d+$/.test(seed)) {
        totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        initialTotalSeconds = totalSeconds;
        currentPrediction = generateNumbers(parseInt(seed), totalSeconds);
        predictionResult.textContent = currentPrediction.join('');
        renderPredictionDigits(currentPrediction);
        updateCountdownDisplay();
      } else {
        predictionResult.textContent = '-----';
        predictionDigits.innerHTML = '';
      }
    }

    function renderPredictionDigits(numbers) {
      predictionDigits.innerHTML = '';
      numbers.forEach(num => {
        const btn = document.createElement('button');
        btn.classList.add('digit-btn');
        btn.textContent = num;
        btn.addEventListener('click', () => handleDigitClick(num));
        predictionDigits.appendChild(btn);
      });
    }

    function handleDigitClick(digit) {
      let seed = seedInput.value;
      if (seed.length === 5) {
        seed = digit + seed.slice(0, 4);
        seedInput.value = seed;

        // his တစ်ခုတိုး
        let hisVal = parseInt(hisInput.value) || 0;
        hisVal += 1;
        hisInput.value = hisVal;

        updatePrediction();
      }
    }

    function startCountdown() {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      totalSeconds = initialTotalSeconds;
      updateCountdownDisplay();
      finalResult.textContent = '-----';
      countdownInterval = setInterval(() => {
        totalSeconds--;
        updateCountdownDisplay();
        if (totalSeconds <= 0) {
          clearInterval(countdownInterval);
          countdownDiv.textContent = "00:00:00";
          setTimeout(() => {
            finalResult.textContent = currentPrediction.join('');
            if (autoMode) {
              setTimeout(() => {
                cycleNumber++;
                cycleCount.textContent = cycleNumber;
                cycleCounter.textContent = `လုပ်ဆောင်ပြီးအကြိမ်ရေ: ${cycleNumber}`;
                startCountdown();
              }, 2000);
            }
          }, 1000);
        }
      }, 1000);
    }

    function updateCountdownDisplay() {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      countdownDiv.textContent = 
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`;
    }

    function generateNumbers(seed, timeSeed) {
      const numbers = [];
      let tempSeed = seed + timeSeed;

      const multiplier = parseInt(multiplierInput.value) || 48271;
      const modulus = parseInt(modulusInput.value) || 2147483647;
      const his = parseInt(hisInput.value) || 0;

      for (let i = 0; i < 5; i++) {
        tempSeed = (tempSeed * multiplier + seed + his) % modulus;
        const num = Math.floor(tempSeed % 10);
        numbers.push(num);
      }
      return numbers;
    }

    function setAutoMode(enabled) {
      autoMode = enabled;
      if (enabled) {
        statusLed.classList.add('active');
        statusText.textContent = 'Auto Mode: ဖွင့်ထားသည်';
        statusText.style.color = '#00c853';
        cycleNumber = 1;
        cycleCount.textContent = cycleNumber;
        cycleCounter.textContent = `လုပ်ဆောင်ပြီးအကြိမ်ရေ: ${cycleNumber}`;
        startCountdown();
      } else {
        statusLed.classList.remove('active');
        statusText.textContent = 'Auto Mode: ပိတ်ထားသည်';
        statusText.style.color = '#f44336';
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
      }
    }

    seedInput.addEventListener('input', updatePrediction);
    multiplierInput.addEventListener('input', updatePrediction);
    modulusInput.addEventListener('input', updatePrediction);
    hisInput.addEventListener('input', updatePrediction);
    hoursInput.addEventListener('input', updatePrediction);
    minutesInput.addEventListener('input', updatePrediction);
    secondsInput.addEventListener('input', updatePrediction);

    manualStartBtn.addEventListener('click', () => {
      if (autoMode) setAutoMode(false);
      updatePrediction();
      startCountdown();
    });
    autoStartBtn.addEventListener('click', () => setAutoMode(true));
    autoStopBtn.addEventListener('click', () => setAutoMode(false));

    updatePrediction();
  
