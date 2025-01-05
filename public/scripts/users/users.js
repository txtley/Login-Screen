const Domains = ['outlook.com', 'yahoo.com', 'hotmail.com', 'gmail.com'] // Listing all the possible domain names the user could have 

// Function to get the specific fields from the button that is clicked
export function GetFields (specificButton) {
  if (specificButton === 'personal-save-button') {
    // Defining the fields in an object
    let params = {
      firstname: document.getElementById('first-name').value,
      lastname: document.getElementById('last-name').value,
      phonenumber: document.getElementById('phone-number').value
    }
    SaveButtonHandler(params)
  } else if (specificButton === 'email-save-button') {
    // Defining the fields in an object
    let params = {
      email: document.getElementById('email').value
    }
    // Checking to see if there is a value
    for (let key in params) {
      if (params[key] === '') {
        alert('No email provided');
        return;
      }
    }
    // Checking to see if the domain is present
    let emailDomain = params.email.split('@')[1];
    if (!Domains.includes(emailDomain)) {
      alert('Invalid email format.');
      return;
    }
    return params;
  } else if (specificButton === 'password-save-button') {
    // Defining the fields in an object
    let params = {
      CurrentPassword: document.getElementById('current-password').value,
      NewPassword: document.getElementById('new-password').value,
      ConfirmPassword: document.getElementById('confirm-password').value
    }
    for (let key in params) {
      if (params[key] === '') {
        alert('All fields are required.');
        return;
      }
    }
    // Checking to see if the new passwords are equal to ensure there are no typos
    if (params.NewPassword !== params.ConfirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    return params;
  }
}

// Function to make the backend request so that the database can be altered
function SaveButtonHandler(params) {
  console.log('Fields to be saved:', params);
  // Send the params to the backend to alter the values in the database
  fetch("http://localhost:3000/change-user-details", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: params }),
  }
)}
