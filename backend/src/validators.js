const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration({ fullName, email, password }) {
  const errors = {};

  if (typeof fullName !== "string" || fullName.trim().length < 2) {
    errors.fullName = "Имя должно содержать не менее 2 символов";
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.email = "Введите корректный email адрес";
  }

  if (typeof password !== "string" || password.length < 8) {
    errors.password = "Пароль должен содержать не менее 8 символов";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateLogin({ email, password }) {
  const errors = {};

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.email = "Введите корректный email адрес";
  }

  if (typeof password !== "string" || password.length === 0) {
    errors.password = "Введите пароль";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
