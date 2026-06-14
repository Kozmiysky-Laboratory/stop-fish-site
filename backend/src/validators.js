const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration({ fullName, email, password }) {
  const errors = {};

  if (typeof fullName !== "string" || fullName.trim().length < 2) {
    errors.fullName = "Имя должно содержать не менее 2 символов";
  } else if (fullName.length > 200) {
    errors.fullName = "Имя не должно превышать 200 символов";
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.email = "Введите корректный email адрес";
  } else if (email.length > 254) {
    errors.email = "Email не должен превышать 254 символа";
  }

  if (typeof password !== "string" || password.length < 8) {
    errors.password = "Пароль должен содержать не менее 8 символов";
  } else if (password.length > 128) {
    errors.password = "Пароль не должен превышать 128 символов";
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
