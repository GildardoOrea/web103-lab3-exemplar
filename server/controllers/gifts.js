import { pool } from '../db/db.js'

export const getGifts = async (request, response) => {
    try {
        const results = await pool.query('SELECT * FROM gifts ORDER BY id ASC');
        response.status(200).json(results.rows);
    }
    catch (error) {
        response.status(409).json({ error: error.message });
    }
}

// Define an asyncronous function
const createGift = async (req, res) => {
    try {
        // In the try block, parse the name, pricepoint, audience, image, description, submittedby, and submittedon from the req.body
        // req.body is an object regardless of the order they appear in
        // This feature of req.body is called ---OBJECT DESTRUCTURING-- 
        // the req will look something like "
        // req.body = {
        // description: "A cool handmade mug",
        // image: "mug.png",
        // audience: "Coffee lovers",
        // pricepoint: 15,
        // name: "Ceramic Mug",
        // submittedon: "2026-06-24",
        // submittedby: "Jane Doe"
        // }"
        const { name, pricepoint, audience, image, description, submittedby, submittedon } = req.body
        const results = await pool.query(`
            INSERT INTO gifts (name, pricepoint, audience, image, description, submittedby, submittedon)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, pricepoint, audience, image, description, submittedby, submittedon]);
        // Next, send a 201 status and return the row from the database that we just inserted to indicate that the request was successful.
        //When a frontend (like a React app or a web browser) sends data to your server, it is waiting in suspense to find out if the operation actually worked. Your server communicates the result using HTTP Status Codes.
        // Here is the exact breakdown of that code:
        // res: This stands for "response." It is the object that represents the message your server is going to send back to the client.
        // .status(): This is a method used to attach a specific numerical code to your response.
        // 201: This specific number is the universal web standard that translates to "Created." ### Why use 201?
        res.status(201).json(results.rows[0])

        // To give the frontend exactly what it wants, we have to drill down into that massive object:
        // .rows: This tells JavaScript to ignore all the extra metadata and just look at the rows array, which holds the actual data we just inserted.
        // [0]: Because .rows is always an array (even if you only inserted one single item), your newly created gift is sitting at the very first position in that array (index 0).
    }
    catch(error) {
        res.status(409).json({error: error.message})
    }
}