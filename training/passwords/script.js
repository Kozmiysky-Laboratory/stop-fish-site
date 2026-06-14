document.addEventListener('DOMContentLoaded', () => {

    const passwordInput = document.getElementById('passwordInput');
    const strengthIndicator = document.getElementById('strengthIndicator');
    const strengthText = document.getElementById('strengthText');
    const togglePassword = document.getElementById('togglePassword');

    if (passwordInput && strengthIndicator && strengthText && togglePassword) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = checkPasswordStrength(password);
            updateStrengthIndicator(strength);
        });

        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });

    } else {
        console.warn("Password trainer: required DOM elements not found (#passwordInput, #strengthIndicator, #strengthText, or #togglePassword).");
    }


    function checkPasswordStrength(password) {
        let score = 0;
        if (!password) return 0;

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

        if (hasUpperCase) score += 1;
        if (hasLowerCase) score += 1;
        if (hasDigit) score += 1;
        if (hasSpecialChar) score += 1;
        
        if (password.length >= 10) score += 0.5;
        if (password.length >= 14) score += 0.5;
        if (password.length >= 18) score += 0;

        return score;
    }

    function updateStrengthIndicator(strength) {
        let width = (strength / 5) * 100;
        let color = '#ff0000';
        let text = 'Очень слабый';

        if (strength >= 2) {
            color = '#ff9800';
            text = 'Средний';
        }
        if (strength >= 3.5) {
            color = '#4caf50';
            text = 'Надежный';
        }
        if (strength >= 4.5) {
            color = '#8bc34a';
            text = 'Очень надежный';
        }

        strengthIndicator.style.width = `${width}%`;
        strengthIndicator.style.backgroundColor = color;
        strengthText.innerHTML = `Надежность: **${text}**`;
        strengthText.style.color = color;
    }
});
