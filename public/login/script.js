class login {
    constructor (email, password) {
        this.email = email; 
        this.password = password;
    }

    areTextboxesEmpty() {
        const result = checkIfTextboxesAreEmpty()
        if (!result) {
            // Assuming peopleArray contains objects with user data
            fetch('http://127.0.0.1:3000/check-if-textboxes-are-empty', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:  JSON.stringify({ email: this.email, password: this.password}), // Send entire array of users
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error('Error:', err);
            });
        } console.log('Details are incomplete')
    }
}


// Setting Visibilty
document.getElementById('labels').style.visibility = 'hidden'
document.getElementById('createaccount').style.visibility = 'hidden'

// Function to check if there are values in textboxes
function checkIfTextboxesAreEmpty () {
    const textboxValues = [] // List to loop through
    let valueofPassword = document.getElementById('password').value;
    let valueofEmail = document.getElementById('email').value; 

    // Pushing the values to the list
    textboxValues.push(valueofPassword, valueofEmail)

    for (let i = 0; i < textboxValues.length; i++) {
        if (textboxValues[i] === '') {
            document.getElementById('labels').style.visibility = 'visible'
            document.getElementById('createaccount').style.visibility = 'visible'
            return false; // Return false if any textbox is empty
        }
      document.getElementById('labels').style.visibility = 'hidden'  
      document.getElementById('createaccount').style.visibility = 'hidden'  
    } return true; 
}


function logUserin() {
    const loginInstance = new login(document.getElementById('email').value, document.getElementById('password').value);
    loginInstance.areTextboxesEmpty();
}