// Get the confirmation popup element
const confirmationPopup = document.getElementById('confirmationPopup');

// Get all the form buttons
const editRankButtons = document.querySelectorAll('.btn-2');
const addKillsButtons = document.querySelectorAll('.btn-3');
const addWinsButtons = document.querySelectorAll('.btn-4');
const removeMemberButtons = document.querySelectorAll('.btn-5');

// Helper function to determine the action URL based on the form ID or other criteria
function determineActionUrl(memberId, actionType) {
  // Determine the action URL based on memberId and actionType
  // Implement your logic here to return the appropriate URL
  // You can use a switch statement or conditional statements

  let actionUrl = '';

  // Example logic:
  switch (actionType) {
    case 'editRank':
      actionUrl = `/member/${memberId}/edit`;
      break;
    case 'addKills':
      actionUrl = `/member/${memberId}/edit`;
      break;
    case 'addWins':
      actionUrl = `/member/${memberId}/edit`;
      break;
    case 'removeMember':
      actionUrl = `/member/${memberId}/delete`;
      break;
    default:
      break;
  }

  return actionUrl;
}

// Function to handle the confirmation popup
function handleConfirmationPopup(event) {
  event = event || window.event; // Add this line to handle the event parameter

  const target = event.target || event.srcElement; // Update this line


  // Check if the clicked element is the "Proceed" button
  if (target.classList.contains('btn-proceed')) {
    const form = confirmationPopup.querySelector('form');
    const memberId = form.getAttribute('data-member-id');
    const actionUrl = form.getAttribute('action');

    // If the memberId and actionUrl are valid, submit the form
    if (memberId && actionUrl) {
      form.submit();
    } else {
      console.log('Invalid memberId or actionUrl');
    }

    // Hide the confirmation popup
    confirmationPopup.style.visibility = 'none';
  }
}

// Attach event listener to the confirmationPopup element
confirmationPopup.addEventListener('click', handleConfirmationPopup);

// Attach event listeners to the form buttons
editRankButtons.forEach((button) => {
  button.addEventListener('click', function() {
    const memberId = this.parentNode.parentNode.getAttribute('data-member-id');
    handleConfirmationPopup(memberId, 'editRank');
  });
});

addKillsButtons.forEach((button) => {
  button.addEventListener('click', function() {
    const memberId = this.parentNode.parentNode.getAttribute('data-member-id');
    handleConfirmationPopup(memberId, 'addKills');
  });
});

addWinsButtons.forEach((button) => {
  button.addEventListener('click', function() {
    const memberId = this.parentNode.parentNode.getAttribute('data-member-id');
    confirmationPopup.style.visibility = "visible"
    handleConfirmationPopup(memberId, 'addWins');
  });
});

// Attach event listener to the "Proceed" button in the confirmation popup
document.querySelector('.btn-proceed').addEventListener('click', function() {
  const memberId = this.parentNode.parentNode.getAttribute('data-member-id');
  handleConfirmationPopup(memberId, 'proceed');
});