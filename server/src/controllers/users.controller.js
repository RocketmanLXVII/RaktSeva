const bcrypt = require('bcrypt');
const db = require('../db/index.js'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
// Function to register a user
exports.registerUser = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;

        if (!email || !username || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required details' });
        }

        const userCheckQuery = 'SELECT * FROM users WHERE email = ?';
        const existingUser = await queryAsync(userCheckQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const insertUserQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        await queryAsync(insertUserQuery, [username, email, hashedPassword, role]);

        // Return success response
        return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Convert db.query to return a promise
const queryAsync = (query, values) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // console.log('Email received for login:', email);
        // console.log('Password received for login:', password);

        const userCheckQuery = 'SELECT password,role FROM users WHERE email = ?';
        const result = await queryAsync(userCheckQuery, [email]);
        console.log(result);
        console.log("Entered password", password);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        if (result && result.length > 0) {
            const existingUser = result[0];
            console.log(existingUser.role);
            console.log("actual password : ", existingUser.password);
            console.log(bcrypt.compare(password, existingUser.password));

            if (await bcrypt.compare(password, existingUser.password) && role == existingUser.role) {
                return res.status(201).json({ message: 'Login successful' });
            } else if (role != existingUser.role) {
                return res.status(403).json({ message: 'Unauthorized login!' });
            } else {
                return res.status(409).json({ message: 'Invalid Password!' });
            }
        } else {
            return res.status(400).json({ message: 'User login failed! User not found.' });
        }
    } catch (err) {
        console.error('Error while logging in!', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.requestBlood = async (req, res) => {
    try {
        const { blood_type, quantity, urgency, hospital_name } = req.body; // Ensure 'hospital_name' is passed correctly

        // Validate inputs
        if (!blood_type || !quantity || !urgency || !hospital_name) {
            console.log(blood_type);
            console.log(quantity);
            console.log(urgency);
            console.log(hospital_name);
            return res.status(400).json({ error: 'All fields are required' });

        }

        // Insert the blood request into the bloodRequests table
        const query = `
            INSERT INTO blood_requests (blood_type, quantity, urgency, hospital_name, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        // Execute the query without wrapping in `db.query` unnecessarily
        await queryAsync(query, [blood_type, quantity, urgency, hospital_name, 'Pending']);

        return res.status(200).json({ message: 'Blood request submitted successfully' });
    } catch (err) {
        console.error('Error submitting blood request:', err);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

exports.patientUsage = async (req, res) => {
    try {
        const { blood_type, quantity, disease, patient_name } = req.body; // Ensure 'hospital_name' is passed correctly

        // Validate inputs
        if (!blood_type || !quantity || !disease || !patient_name) {
            console.log(blood_type);
            console.log(quantity);
            console.log(disease);
            console.log(patient_name);
            return res.status(400).json({ error: 'All fields are required' });

        }

        // Insert the blood request into the bloodRequests table
        const query = `
            INSERT INTO patient_details (blood_type, quantity, disease, patient_name)
            VALUES (?, ?, ?, ?)
        `;

        // Execute the query without wrapping in `db.query` unnecessarily
        await queryAsync(query, [blood_type, quantity, disease, patient_name]);

        return res.status(200).json({ message: 'Patient details submitted successfully' });
    } catch (error) {
        console.error("Error while adding patient's details");
        res.status(500).json({ message: 'Internal server error!' })
    }
}

exports.bloodUsage = async (req, res) => {
    try {
        const query = `
            SELECT blood_type, SUM(quantity) AS total_quantity 
            FROM patient_details 
            GROUP BY blood_type
        `;

        const result = await queryAsync(query);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching blood usage data:', error);
        res.status(500).json({ error: 'Failed to retrieve blood usage data' });
    }
};

exports.getInventoryUpdate = async (req, res) => {
    try {
        const query = `
            SELECT blood_type, quantity
            FROM blood_bank_inventory
        `;
        const result = await queryAsync(query);
        console.log(result);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in fetching inventory : ", error);

    }
};

exports.getHospitalRequest = async (req, res) => {
    try {
        const query = `
            SELECT request_id,hospital_name,blood_type,quantity,urgency 
            FROM blood_requests
        `
        const result = await queryAsync(query)
        console.log(result);
        return res.status(200).json(result)
    } catch (error) {
        console.error("Error while fetching request : ", error);

    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { request_id, newStatus } = req.body;

        console.log(newStatus);
        const query = `
        UPDATE blood_requests
        SET status = ?
        where request_id = ?
        `

        await queryAsync(query, [newStatus, request_id]);


        // Send success response
        res.status(200).json({ message: "Status updated successfully" });


    } catch (error) {
        console.error("Error while changing status", error);
        res.status(500).json({ message: "Error in updating status" });
    }
}

exports.getInventoryUpdateBB = async (req, res) => {
    try {
        const query = `SELECT blood_type, quantity
            FROM actual_bb_blood_bank_inventory`

        const result = await queryAsync(query)
        console.log(result);
        return res.status(201).json(result)
    }
    catch (err) {
        console.error("Error in fetching inventory : ", err);
        res.status(500).json({ message: 'Error in fetching!' })
    }
}

exports.addEvent = async (req, res) => {
    try {
        const { eventName, location, date,description, eventStatus } = req.body; 

        // Validate inputs
        if (!eventName || !location || !date || !description || !eventStatus) {
            console.log(eventName);
            console.log(location);
            console.log(date);
            console.log(description);
            return res.status(400).json({ error: 'All fields are required' });

        }

        // Insert the blood request into the bloodRequests table
        const query = `
            INSERT INTO donation_camps (camp_name, location, date, description,status)
            VALUES (?, ?, ?, ?, ?)
        `;

        // Execute the query without wrapping in `db.query` unnecessarily
        await queryAsync(query, [eventName, location, date, description, eventStatus]);

        return res.status(200).json({ message: 'Event submitted successfully' });
    }
    catch (err) {
        console.error("Error while adding event", err);

    }
}

exports.getEvents = async (req, res) => {
    try{
        const query = `
            SELECT camp_name,location,date,status
            FROM donation_camps
        `

        const result = await queryAsync(query)
        return res.status(200).json(result)
    }catch(err){
        console.error("Error while fetching events",err);
        res.status(500).json({message : 'Internal Server error in fetching events!'})
    }
}
exports.addInventoryDC = async (req, res) => {
    try{
        const {donorName,bloodType,quantity,donationDate} = req.body

        // Validate inputs
        if (!donorName || !bloodType || !quantity || !donationDate) {
            console.log(donorName);
            console.log(bloodType);
            console.log(quantity);
            console.log(donationDate);
            return res.status(400).json({ error: 'All fields are required' });

        }

        // Insert the blood request into the bloodRequests table
        const query = `
            INSERT INTO donations (donor_name, blood_type, quantity, donation_date)
            VALUES (?, ?, ?, ?)
        `;

        // Execute the query without wrapping in `db.query` unnecessarily
        await queryAsync(query, [donorName, bloodType, quantity, donationDate]);

        return res.status(200).json({ message: 'Event submitted successfully' });

    }catch(err){
        console.error("Error while updating inventory",err);
        res.status(500).json({message :"Internal Server Error"})
    }
}

exports.getInventoryDC = async (req,res) => {
    try{
        const query = `
        SELECT blood_type,quantity
        FROM camp_inventory
        `

        const result = await queryAsync(query)

        return res.status(201).json(result)
    }
    catch(err){
        console.error("Error in fetching the invetory of the Donation Camp",err);
        return res.status(500).json({message : "Internal Server Error!"})
    }
}