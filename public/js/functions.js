/* eslint-disable no-unused-vars */
function toggleReplyDiv(divId) {
  // eslint-disable-next-line no-undef
  const targetDiv = document.getElementById(divId);
  // eslint-disable-next-line no-unused-expressions
  (targetDiv.style.display === 'none' || targetDiv.style.display === '') ? targetDiv.style.display = 'block' : targetDiv.style.display = 'none';
}

function checkPassword(password, confirmPassword) {
  // eslint-disable-next-line no-undef
  const passwordValue = document.getElementById(password);
  // eslint-disable-next-line no-undef
  const confirmPasswordValue = document.getElementById(confirmPassword);

  if (passwordValue.value !== confirmPasswordValue.value) {
    confirmPasswordValue.setCustomValidity('Passwords do not match.');
  } else {
    confirmPasswordValue.setCustomValidity('');
  }
}

// password.onchange = validatePassword;
// confirm_password.onkeyup = validatePassword;
