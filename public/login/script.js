const textboxValues = [] // List to loop through
class EnterDetails {
    constructor (email, password) {
        this.email = email; 
        this.password = password;
    }

    // Creating a new object to add to array
    CreateNewObjectVar() {
        let Details = {
            email: this.email,
            password: this.password
        }; 

        this.AddDetailsToArray(Details); 
    }

    // Pushing the details to array to send to backend
    AddDetailsToArray(Details) {
        textboxValues.push(Details); 
        this.SendDetailsToLogin()
    }

    SendDetailsToLogin() {
        let LoginRequest = new Login(textboxValues)
        LoginRequest.login(); 
    }
}

class Login {
   async login() {
        console.log(checkIfTextboxesAreEmpty())
        if (!checkIfTextboxesAreEmpty()) {
            // Assuming peopleArray contains objects with user data
            try {
                const response = await fetch('http://localhost:3000/login', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:  JSON.stringify({ details:textboxValues }), // Send entire array of details
                })
                
                const result = await response.json();

                if (result.redirect) {
                    console.log('hi')
                    // Redirect the browser to the provided URL
                    window.location.href = result.url;
                } else {
                    console.log(result.message); // Handle other responses
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } console.log('Details are incomplete')
    }
}

// Setting Visibilty
document.getElementById('labels').style.visibility = 'hidden'
document.getElementById('createaccount').style.visibility = 'hidden'

function CreateNewObject() {
    let ValueOfEEmail = document.getElementById('email').value;
    let ValueOfPassword = document.getElementById('password').value;
    
    let newInstance = new EnterDetails(ValueOfEEmail, ValueOfPassword); 
    console.log(newInstance); 
    newInstance.CreateNewObjectVar(); 
}

// Function to check if there are values in textboxes
function checkIfTextboxesAreEmpty () {
    let valueofPassword = document.getElementById('password').value;
    let valueofEmail = document.getElementById('email').value; 

    console.log(valueofEmail); 
    console.log(valueofPassword);

    // Pushing the values to the list
    textboxValues.push(valueofPassword, valueofEmail)
    for(let value = 0; value in textboxValues; value++) {
        if (value !== '') {
            return false; 
        } else {
            return true;
        };
    }
}

document.getElementById('LoginButton').addEventListener('click', CreateNewObject);