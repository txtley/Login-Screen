let userID = 1;  
const peopleArray = [];  

// Class to enter a new person into the array 'peopleArray'
class EnterNewPerson {
    constructor(name, dateOfbirth, address, phoneNumber, email, password) {
        this.name = name;
        this.address = address;
        this.dateOfbirth = dateOfbirth;
        this.phoneNumber = phoneNumber; 
        this.email = email; 
        this.password = password; 
    }

    createNewPersonVar() {  // Function to create a person object
        let person = {
            name: this.name,
            address: this.address,
            dateOfbirth: this.dateOfbirth,
            phoneNumber: this.phoneNumber,
            email: this.email,
            password: this.password,
            userID: userID
        }; 
        
        this.addPersonToArray(person); // Sending the object to the next method 
        return person;
    }
    
    addPersonToArray(person) { // Function to add the person to the array 'peopleArray' 
        peopleArray.push(person);
        userID += 1; // Adding one to the id for a new user
    }
}

// Function to send the items to the class when the details have been entered and submitted
function createNewPerson() {
    // Getting the values of the textboxes
    let valueofName = document.getElementById('name').value;
    let valueofAddress = document.getElementById('address').value;
    let valueofDOB = document.getElementById('DOB').value;
    let valueofPhoneNumber = document.getElementById('phonenumber').value;
    let valueofEmail = document.getElementById('email').value; 
    let valueofPassword = document.getElementById('password').value;

    let newPersonInstance = new EnterNewPerson(valueofName, valueofDOB, valueofAddress, valueofPhoneNumber, valueofEmail, valueofPassword); 
    console.log(newPersonInstance)
 
    checkIfPersonExists().then(userExists => {
        console.log('userExists returned', userExists)
        if (userExists) {
            console.table(peopleArray)
            peopleArray.splice(0, 1); // Splicing the array so we're always comparing one person
            document.getElementById('labels').style.visibility = 'visible'; // Show the message
        } else {
            peopleArray.splice(0, 1); 
            newPersonInstance.createNewPersonVar();  // Creates a new ID  
            document.getElementById('labels').style.visibility = 'hidden'; // Hide the message as it is false
            saveUsers(); 
        }
    });
}

function checkIfPersonExists () { // Function to check if the user exists
    return fetch('http://localhost:3000/check-if-user-exists', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify ({ users:peopleArray }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }) 

    .then(data => {
        console.log(data)
        return data.message === 'True'; 
    })
    .catch(err => {
        console.error('Error:', err);
        return false; 
    })
};



function getUserID () { // This will be executed when the user requests their userID
    // Getting values out of the text boxes 
    let valueofName = document.getElementById('name').value;
    let valueofAddress = document.getElementById('address').value;
    let valueofDOB = document.getElementById('DOB').value;
    let valueofPhoneNumber = document.getElementById('phonenumber').value;
    let valueofEmail = document.getElementById('email').value; 

    let doesPersonExist = new enterNewPerson(valueofName, valueofDOB, valueofAddress, valueofPhoneNumber, valueofEmail); // Making a new variable to run through vlass
    
    // Checking if the same details already exist in the array
    let existingPerson = peopleArray.find(person => 
        person.name === doesPersonExist.name && 
        person.dateOfbirth === doesPersonExist.dateOfbirth &&
        person.address === doesPersonExist.address &&
        person.phoneNumber === doesPersonExist.phoneNumber &&
        person.email === doesPersonExist.email
    );
    
    if (existingPerson) {
        console.log('UserID:', existingPerson.userID); // Logging the userID
    } else {
        console.log('Person not found');
    }
}

// Function to check if there are values in textboxes
function checkIfTextboxesAreEmpty () {
    textboxValues = [] // List to loop through
    let valueofName = document.getElementById('name').value;
    let valueofAddress = document.getElementById('address').value;
    let valueofDOB = document.getElementById('DOB').value;
    let valueofPhoneNumber = document.getElementById('phonenumber').value;
    let valueofEmail = document.getElementById('email').value; 

    // Pushing the values to the list
    textboxValues.push(valueofName, valueofAddress, valueofDOB, valueofPhoneNumber, valueofEmail)
    for(let value = 0; value in textboxValues; value++) {
        if (value !== '') {
            return true 
        } else {
            return false 
        };
    }
}

// Sending data to the backend
function saveUsers() {
    areTextboxesEmpty = checkIfTextboxesAreEmpty(); // Check if there are values in the textbox
    if (areTextboxesEmpty) {
        // Assuming peopleArray contains objects with user data
        fetch('http://127.0.0.1:3000/save-users', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: peopleArray }), // Send entire array of users
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error('Error:', err);
        });
    }
}

// Event Listeners
document.getElementById('submitButton').addEventListener('click', createNewPerson);

