// Use CommonJS module system
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = 3000; 
let count = 0
let userID = 0


app.use(cors({ origin: 'http://localhost:3000',
               credentials: true
 })); // Defining CORS so that the backend and frontend can talk to each other 
app.use(express.json()); // Defining the module we will be using 
app.use(express.static(path.join(__dirname, 'public'))); // Setting up backend to manage static files

// Log in Route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login/index.html')); 
}); 

// Create account route 
app.get('/login/createaccount', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login/createaccount/index.html'))
})


// API endpoint to save users data
app.post('/save-users', async (req, res) => {
    const users = req.body.users; // Access the array of user
    const header = 'Name : Address : Date of Birth : Phone Number : Email : ID\n'// Creating the header for the database
    
    // Checking whether the server has been accessed before, if not, the header will be added
    try {
        if (count === 0) {
            await writeHeader(); // Write the header
        }
        await addUserToFile(users, res); // Ignore and add user to the file instead
        } catch (err) {
            console.error('Error saving data', err)
            res.status(500).send('Error saving data'); 
        }

    // Function to write the header 
    async function writeHeader () {
            try {
                await fs.writeFile('users.txt', header); 
                console.log('Header written successfully'); 
                count = 1; // Setting the count variable to 1 so the header isnt drawn again
            } catch (err) {
                console.error('Error writing the header', err); 
                throw err
           }
    }

    // Function to check whether the user exists
    async function doesUserExist(userString) {
        try {
            const data = await fs.readFile('users.txt', 'utf8'); 
            return data.includes(userString); // Checking to see if the data already exits in the database
        } catch (err) {
            console.error('Error reading data', err)
            throw err
        }
    }
    
    // Function to add the user to the database
    async function addUserToFile(users, res) {
        let userIDString = ` :  ${userID}` // Creating the ID string which will be attached on the end of the user's details
        if (users && users.length > 0) {
            for (const user of users) { // Looping through the users 
                const userString = `${user.name} : ${user.address} : ${user.dateOfbirth} : ${user.phoneNumber} : ${user.email}`; // Creating the user's variable 
             
                const exists = await doesUserExist(userString) // Confirming to see if the user is already in the database so that we dont have redundant data
                console.log(exists)

                if (!exists) { // If the user doesnt exist
                    try {
                        await fs.appendFile('users.txt', userString); // Add their details to the database
                        console.log(userString, 'has been added')
                        await fs.appendFile('users.txt', userIDString); // Adding the string onto the end of the user variable
                        userID += 1 
                    } catch (err) {
                        console.error('Error appending user to the file')
                        return res.status(500).send('Error saving data'); 
                    }
                } else {
                    return res.status(200).send('User already exists'); 
                }
            }
            return res.status(200).send('Data saved successfully');
        } else {
            return res.status(400).send('No users provided');
        }
    }
}); 



// Start the server
app.listen(port, () => { // Message to display if the server is active 
    console.log('Server running on port 3000');
}); 

