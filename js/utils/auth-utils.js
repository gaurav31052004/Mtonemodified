import CONFIG from '../config/config.js';

export class AuthUtils {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateOTP(otp) {
    if (!otp) {
      return { valid: false, error: 'Please enter the OTP' };
    }
    
    if (otp.length !== 6) {
      return { valid: false, error: 'OTP must be 6 digits' };
    }
    
    if (!/^\d{6}$/.test(otp)) {
      return { valid: false, error: 'OTP must contain only numbers' };
    }
    
    return { valid: true };
  }

  static startOTPTimer(onTick, onComplete) {
    let timeLeft = CONFIG.UI.OTP_EXPIRY_TIME / 1000;
    
    const timer = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      if (onTick) {
        onTick(timeString, timeLeft);
      }
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        if (onComplete) {
          onComplete();
        }
      }
      
      timeLeft--;
    }, 1000);
    
    return timer;
  }

  static stopOTPTimer(timer) {
    if (timer) {
      clearInterval(timer);
    }
  }

  static updateStepDisplay(currentStep, steps) {
    steps.forEach(step => {
      const element = document.getElementById(`${step}-step`);
      if (element) {
        element.style.display = step === currentStep ? 'block' : 'none';
      }
    });
  }

  static updateBackButton(currentStep, firstStep) {
    const backButton = document.getElementById('back-button');
    if (backButton) {
      if (currentStep === firstStep) {
        backButton.classList.add('hidden');
      } else {
        backButton.classList.remove('hidden');
      }
    }
  }

  static clearInput(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.value = '';
    }
  }

  static hideTimerElements() {
    const otpTimer = document.getElementById('otp-timer');
    const resendOtp = document.getElementById('resend-otp');
    if (otpTimer) otpTimer.classList.add('hidden');
    if (resendOtp) resendOtp.classList.add('hidden');
  }

  static toggleTimerElements(showTimer) {
    const timerElement = document.getElementById('otp-timer');
    const resendButton = document.getElementById('resend-otp');
    
    if (timerElement && resendButton) {
      if (showTimer) {
        resendButton.style.display = 'none';
        timerElement.style.display = 'block';
      } else {
        timerElement.style.display = 'none';
        resendButton.style.display = 'block';
      }
    }
  }

  static updateTimerDisplay(timeString) {
    const timerElement = document.getElementById('otp-timer');
    if (timerElement) {
      timerElement.textContent = `Resend OTP in ${timeString}`;
    }
  }
}

export class OTPTimerManager {
  constructor() {
    this.timer = null;
  }

  start() {
    this.stop(); // Clear any existing timer
    
    AuthUtils.toggleTimerElements(true);
    
    this.timer = AuthUtils.startOTPTimer(
      (timeString) => {
        AuthUtils.updateTimerDisplay(timeString);
      },
      () => {
        this.stop();
        AuthUtils.toggleTimerElements(false);
      }
    );
  }

  stop() {
    if (this.timer) {
      AuthUtils.stopOTPTimer(this.timer);
      this.timer = null;
    }
  }
}