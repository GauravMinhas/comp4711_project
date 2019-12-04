/* eslint-disable no-unused-vars */
function toggleReplyDiv(divId) {
  // eslint-disable-next-line no-undef
  const targetDiv = document.getElementById(divId);
  // eslint-disable-next-line no-unused-expressions
  (targetDiv.style.display === 'none' || targetDiv.style.display === '') ? targetDiv.style.display = 'block' : targetDiv.style.display = 'none';
}
