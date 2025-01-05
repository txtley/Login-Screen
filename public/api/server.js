// Use ES module system
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
const app = express();
const port = 3000;
import sql from "mssql";
import url from 'url';
import http from 'http';
import { json } from "stream/consumers";

// CORS Options
const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
// Defining CORS so that the backend and frontend can talk to each other

//SQL Config
const config = {
    user: 'admin',
    password: 'admin',
    server: 'localhost\\SQLEXPRESS', 
    port: 1433, 
    database: 'Products', 
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true,
        trustServerCertificate: true, // Change to true if you are connecting to a server running under a different certificate authority (CA)
    }
}

app.use(express.json()); // Defining the module we will be using
// app.use(express.static(path.join(__dirname, "public"))); // Setting up backend to manage static files

// Log in Route

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login/index.html"));
});

// Create account route
app.get("/login/createaccount", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login/createaccount/index.html"));
});

// Creating product routes
app.post("/product-routes", (req, res) => {
  const productRequested = req.body.product; // Accessing the user's product request

  try {
    return res
      .status(200)
      .json({ redirect: true, url: `http://127.0.0.1:5500/public/products/${productRequested}/${productRequested}.html`})
  } catch (error) {
    res.status(500).send("Error getting product routes");
  }
})

app.post("/dropdown-routes", (req, res) => {
  const dropdownRequestBody = req.body.dropdownOption; // Accessing the user's dropdown request
  console.log(dropdownRequestBody)

  function FindDropdown () {
    if (dropdownRequestBody === 'my-account-btn') {
      return 'myaccount'
    }

    if (dropdownRequestBody === 'login-btn') {
      return 'login'
    }

    if (dropdownRequestBody === 'shopping-cart-btn') {
      return 'my-cart'
    }
  }
  
  const dropdownRequested = FindDropdown(dropdownRequestBody); // Finding the URL for the dropdown option
  try {
    return res
     .status(200)
     .json({ redirect: true, url: `http://127.0.0.1:5500/public/${dropdownRequested}/index.html` })
  } catch (error) {
    res.status(500).send("Error getting dropdown routes");
  }
})

// API Endpoint to change the user details 
app.post("/change-user-details", async (req, res) => {
  const personalInformationParams = ['firstname', 'lastname', 'phonenumber']
  const emailParams = ['email']
  const passwordParams = ['currentPassword', 'newPassword']


  // Identify which query we need to use. I will do this by checking the name of the first field, as no fields cross over each other
  const Fields = req.body.fields
  const fieldNames = Object.keys(Fields);

  for (let fieldName of fieldNames) {
    console.log(fieldName)
    if (fieldName.includes(personalInformationParams[0])) {
      await personalInformation(res)
      return
    } else if (fieldName.includes(emailParams[0])) {
      await Email(res)
      return
    } else if (fieldName.includes(passwordParams[0])) {
      await Password(res)
      return
    }
  }
  
  // Before Querying, retrieve the relevant id for the user
  
  // Query the database to update the user details
  async function personalInformation(res) {
    // Start the connection with the database
    const pool = await sql.connect(config);
    try {
      await pool.query(
        `UPDATE Users SET firstname = '${Fields.firstname}', address = '${Fields.address}', DateOfBirth = '${Fields.dob}', phonenumber = '${Fields.phonenumber}'  WHERE ID = '${Fields.id}'`
      )
    } catch (error) {
      console.error("Error updating user details", error);
      res.status(500).send("Error updating user details");
    }
  }

  async function Email(res) {
    // Start the connection with the database
    const pool = await sql.connect(config);
    try {
      await pool.query(
        `UPDATE Users SET email = '${Fields.email}'  WHERE ID = '${Fields.id}'`
      )
    } catch (error) {
      console.error("Error updating user details", error);
      res.status(500).send("Error updating user details");
    }
  }

  async function Password(res) {
    // Start the connection with the database
    const pool = await sql.connect(config);
    try {
      await pool.query(
        `UPDATE Users SET currentPassword = '${Fields.newPassword}'  WHERE ID = '${Fields.id}'`
      )
    } catch (error) {
      console.error("Error updating user details", error);
      res.status(500).send("Error updating user details");
    }
  }
})

// API endpoint to save users data
app.post("/save-users", async (req, res) => {
  const users = req.body.users; // Access the array of user
  const usersString = JSON.stringify(users);
  const notNullValues = ['name', 'dateOfbirth', 'address', 'email', 'password'] // Defining all the values that have to have a value

  // Checking whether the server has been accessed before, if not, the header will be added
  try {
    await CheckUserInputsAreValid(usersString, res); // Ignore and add user to the file instead
  } catch (err) {
    console.error("Error saving data", err);
    res.status(500).send("Error saving data");
  }

  // Function to check whether the user exists
  async function doesUserExist(userDetails) {
    try {
      const poolConnection = await sql.connect(config); 
      const data = await poolConnection.query(
        "SELECT * FROM Users WHERE email = ? AND currentPassword = ?",
        [userDetails.email, userDetails.password]
      ); // Querying the database for users

      return data.recordset.length > 0; // Return true if user exists, false otherwise
    } catch (err) {
      console.error("Error reading data", err);
      throw err;
    }
  }

  // Function to add the user to the database
  async function CheckUserInputsAreValid(usersString, res) {
    console.log(usersString); 

    // Converting the request into an object
    const usersObj = JSON.parse(usersString);

    // Sending the object to check for missing values
    let areThereMissingValues = await CheckForMissingNotNullValues(usersObj);
    if (!areThereMissingValues) {
      // Carry on the data validation
      let isEmailValid = await CheckEmailIsValid(usersObj[0].email);
      if (isEmailValid) {
        console.log('Email is valid')
        let isPhoneNumberValid = await CheckPhoneNumberIsValid(usersObj[0].phoneNumber);
        if (isPhoneNumberValid) {
          console.log('Phone number is valid')
          let isDateValid = await CheckDateOfBirth(usersObj[0].dateOfbirth);
          if (isDateValid) {
            return true;
          } else {
          return res.status(400).json({ message: 'Date of Birth is not valid' }); 
          }
        } else { 
        return res.status(400).json({ message: 'Invalid phone number' }); 
        }
      } else {
      return res.status(400).json({ message: 'Invalid date of birth' }); 
      }
    } else {
      return res.status(400).json({ message: 'Missing values:', data: areThereMissingValues }); 
      }
  }

  async function CheckForMissingNotNullValues(usersObj) {
    // Make a temporary array to store all the missing not null values
    let missingValues = []; 

    // Loop through the array and and check if all not null values are filled 
    for (let value = 0; value < notNullValues.length; value++) {
      let valueToCheck = notNullValues[value];
      if (usersObj[0][valueToCheck] === '') {
        missingValues.push(valueToCheck);
      } 
    }

    // If there are missing values, return the values missing back
    if (missingValues.length > 0) {
      return true, missingValues; 
    }
    return false;
  }
  
  async function CheckEmailIsValid(email) {
    console.log(email)
    // Validate the email address format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async function CheckPhoneNumberIsValid(phonenumber) {
    // Validate the phone number format
    const phoneRegex = /^(?:\+?[1-9]\d{1,14}|0\d{9,10})$/;
    return phoneRegex.test(phonenumber);
  }

  async function CheckDateOfBirth(date) {
    // Validate the date of birth format
    const dateRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

    // Check if the date matches the regex
    if (!dateRegex.test(date)) {
      return false; // Invalid format
    }

    // Parse the date into day, month, and year
    const [day, month, year] = date.split('/').map(Number);

    // Check if the parsed date is valid
    const inputDate = new Date(year, month - 1, day);
    if (
      inputDate.getFullYear() !== year ||
      inputDate.getMonth() !== month - 1 ||
      inputDate.getDate() !== day
    ) {
      return false; // Invalid date
    }
    
    const today = new Date(); 
    const age = today.getFullYear() - year - (today.getMonth() < month - 1 || today.getMonth() === month - 1 && today.getDate() < day ? 1 : 0);

    return age >= 18; // Returning true if the user is 18 or older
  }
})



app.post("/login", async (req, res) => {
  console.log("Login request recieved");
  const details = req.body.details; // Creating the details's variable

  await LogUserIn(details, res);
  // Function to check whether the user exists
  async function doesUserExist(userDetails) {
    try {
      const poolConnection = await sql.connect(config); 
      const data = await poolConnection.query(
        "SELECT * FROM Users WHERE email = ? AND currentPassword = ?",
        [userDetails.email, userDetails.password]
      ); // Querying the database for users

      return data.recordset.length > 0; // Return true if user exists, false otherwise
    } catch (err) {
      console.error("Error reading data", err);
      throw err;
    }
  }

  // Function to log the user in
  async function LogUserIn(req, res) {
    if (details && details.length > 0) {
      for (const detail of details) {
        // Looping through the users
        const userDetails = {
          email: detail.email,
          password: detail.password,
        }; // Creating the user's object

        const exists = await doesUserExist(userDetails);
        console.log("User Exists", exists);

        if (exists) {
          // If the user does exist
          try {
            return res
              .status(200)
              .json({ redirect: true, url: "http://localhost:3000/products/" }); // Redirect to the main dashboard
          } catch (error) {
            return { status: "invalid", message: "No users provided " }; // If no users were provided
          }
        } else {
          return res.status(200).send({ message: "User doesnt exist" }); // If no users exist
        }
      }
      return res.status(400).send("Login successful"); // Send a message back to say login was successful
    } else {
      return res.status(400).send("No users provided"); // If no users were provided
    }
  }
});

// Call to check if any users
app.post("/check-if-user-exists", async (req, res) => {
  const users = req.body.users; // Access the array of users

  // Function to check whether the user exists
  async function doesUserExist(userDetails) {
    try {
      const poolConnection = await sql.connect(config); 
      const data = await poolConnection.query(
        "SELECT * FROM Users WHERE email = ? AND currentPassword = ?",
        [userDetails.email, userDetails.password]
      ); // Querying the database for users

      return data.recordset.length > 0; // Return true if user exists, false otherwise
    } catch (err) {
      console.error("Error reading data", err);
      throw err;
    }
  }

  // Function to add the user to the database
  async function CheckUser(users, res) {
    if (users && users.length > 0) {
      for (const user of users) {
        // Looping through the users
        const userString = `${user.name} : ${user.address} : ${user.dateOfbirth} : ${user.phoneNumber} : ${user.email}`; // Creating the user's variable
        console.table(userString);

        try {
          const exists = await doesUserExist(userString); // Confirming to see if the user is already in the database so that we dont have redundant data
          console.log("User exists", exists);

          if (exists) {
            return { status: "exists", message: "True" }; // Sending message back to say user exists
          }
        } catch (error) {
          return { status: "invalid", message: "No users provided" }; // Sending message back if no users were provided
        }
      }
      return res.status(200).json({ message: "False" }); // Sending message back if there no user exists
    } else {
      return res.status(400).json({ message: "No users provided" }); // Sending message back if no users were provided
    }
  }

  // Try statement to send back to frontend
  try {
    const result = await CheckUser(users);
    if (result.status === "exists") {
      // If user exists
      res.status(200).json({ message: result.message });
    } else if (result.status === "does-not-exist") {
      // If user doesnt exist
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message }); // If no users were provided
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});



// Specifing the gap between each filter
function filterGaps (url) {
  console.log(url); 
  
  // Specfing the filter gaps for each product
  const cakes = {
    price: 19.99, 
    shotsFired: 19.99, 
    duration: 19.99, 
  }
  const fountains = {
    price: 4.99, 
    duration: 9.99, 
  }
  const rockets = {
    price: 9.99, 
  }
  const sparklers = {
    price: 4.99, 
  }
  const selectionBox = {
    price: 19.99, 
  }

  // Making a string array to check if it exists in the URL
  const productsSTR = ['cakes', 'fountains', 'rockets', 'sparklers', 'selectionboxes']

  // Making an object array to access the product objects by their index in the string array
  const productsOBJ = [cakes, fountains, rockets, sparklers, selectionBox]

  // Seeing if the product is in the URL, allowing us to see the page the user is currently on while also getting the product index for the object array
  const productIndex = productsSTR.findIndex(product => 
    url === `http://127.0.0.1:5500/public/products/${product}/${product}.html`
  );

  // Accessing the corresponding object in productsOBJ
  if (productIndex !== -1) {
    const productPage = productsOBJ[productIndex];
    return productPage;
  }
}

app.post("/filter-products", async (req, res) => {
    console.log("Filter request received"); // Message to display if the filter request is received

    // Getting the request from the frontend 
    const filters = req.body.filters;
    const specificFilters = req.body.specificFilters
    const url = req.body.url
    console.log(filters, specificFilters); 

    ConnectAndQuery() 

    // Query the database using the given filters 
    async function ConnectAndQuery() {
      try {
          var poolConnection = await sql.connect(config); 
          let results = []; 
          let findProductGaps = filterGaps(url) 
          console.log('Product Gaps:', findProductGaps); 

          // Checking which filter has been specified
          if ('price' in filters) {
            // Changing the JSON string to an integer
            filters.price = filters.price.map(Number)
            console.log('true', filters.price, filters.price.length)

            // Looping through the specificed filters and querying them in the database
            for (let i = 0; i < filters.price.length; i++) {
              if (filters.price[i] < 91) {
                // Here i am using the result of the filterGaps function to dicate the gaps of the filters for calculation
                let result = await poolConnection.query`
                  SELECT ProductName FROM ProductsTable
                  WHERE Price BETWEEN ${filters.price[i] - findProductGaps.price} AND ${filters.price[i]} 
                `;
                console.log(result)
                results.push(result);
              } else {
                let result = await poolConnection.query`
                  SELECT ProductName FROM ProductsTable
                  WHERE Price ${filters.price[i]}}
                `; 
                console.log(result)
                results.push(result);
              }
            }
          }

          if ('shotsFired' in filters) {
            // Changing the JSON string to an integer
            filters.shotsFired = filters.price.map(Number)
            console.log('true', filters.shotsFired, filters.shotsFired.length)
            
            for (let i = 0; i < filters.shotsFired.length; i++) {
                console.log('true')
                let result = await poolConnection.query`
                  SELECT ProductName FROM ProductsTable 
                  WHERE ShotsFired BETWEEN ${filters.shotsFired[i] - 19.99} AND ${filters.shotsFired[i]}
                `; 
              results.push(result);
            }
          }

          if ('duration' in filters) {
            // Changing the JSON string to an integer
            filters.duration = filters.duration.map(Number)
            console.log('true', filters.duration, filters.duration.length)

            // Looping through the specificed filters and querying them in the database
            for (let i = 0; i < filters.duration.length; i++) {
              console.log('true')
              let result = await poolConnection.query`
                SELECT ProductName FROM ProductsTable 
                WHERE Duration BETWEEN ${filters.duration[i] - 19.99} AND ${filters.duration[i]}
              `; 
              results.push(result);
            }
          }

          if ('brand' in filters) {
            for (let i = 0; i < filters.brand.length; i++) {
              console.log('true')
              let result = await poolConnection.query`
                SELECT ProductName FROM ProductsTable 
                WHERE Brand = ${filters.brand[i]}
              `; 
              console.log(result) 
              results.push(result);
            }
          }
          
          // Sending back to frontend
          res.status(200).json({ message: results })
        } catch (error) {
            console.error('Error', error)
        } finally {
          if (poolConnection) {
            await poolConnection.close(); // Close the database connection
          }
        }
    }
}); 

// Call to match search to products 
app.post("/match-products-to-search", async (req, res) => {
  console.log("Match request received"); // Message to display if the match request is received
  const searchQuery = req.body.searchTerm;
  console.log(searchQuery);

  ConnectAndQuery()
  // Query the database using the given search query
  async function ConnectAndQuery() {
    try {
      var poolConnection = await sql.connect(config);
      let results = [];
      
      // Querying the database using the given search query
      let result = await poolConnection.query`
        SELECT ProductName FROM ProductsTable 
        WHERE ProductName LIKE ${searchQuery} OR ProductType LIKE ${searchQuery} OR Brand = ${searchQuery}
      `;
      results.push(result);
      console.log(results)
      
      // Sending back to frontend
      res.status(200).json({ message: results })
    } catch (error) {
      console.error('Error', error)
    } finally {
      if (poolConnection) {
        await poolConnection.close(); // Close the database connection
      }
    }
  }
})



// Start the server
app.listen(port, () => {
  // Message to display if the server is active
  console.log("Server running on port 3000");
});
