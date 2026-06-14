/**
 * Shared form submission handler for auth pages (login & registration).
 *
 * Usage:
 *   handleAuthForm("loginForm", payload => authApi.login(payload), {
 *     buildPayload: form => ({ email: form.email.value.trim(), password: form.password.value }),
 *     successMessage: "Вы успешно вошли! Перенаправляем…",
 *   });
 */
function handleAuthForm(formId, submitFn, options) {
  var form = document.getElementById(formId);
  var messageEl = document.getElementById("formMessage");
  var submitButton = form.querySelector("button[type='submit']");
  var successMessage = options.successMessage || "Успешно!";
  var buildPayload = options.buildPayload;
  var redirectUrl = options.redirectUrl || "index.html";
  var formatError =
    options.formatError ||
    function (err) {
      return err.message;
    };

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    messageEl.textContent = "";
    messageEl.classList.remove("is-error", "is-success");
    submitButton.disabled = true;

    try {
      await submitFn(buildPayload(form));
      messageEl.textContent = successMessage;
      messageEl.classList.add("is-success");
      window.location.href = redirectUrl;
    } catch (err) {
      messageEl.textContent = formatError(err);
      messageEl.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
    }
  });
}
