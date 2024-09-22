const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv"); // Import the dotenv package

dotenv.config(); // Load the environment variables from .env

const app = express();

app.use(cors());
app.use(express.json());

app
  .route("/bfhl")
  .get((req, res) => {
    res.status(200).json({ operation_code: 1 });
  })
  .post((req, res) => {
    const data = req.body.data || [];
    const fileB64 = req.body.file_b64 || "";
    
    // Initialize response objects
    const numbers = [];
    const alphabets = [];
    let highest_alphabet = "";

    // Process input data
    for (const item of data) {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (item.length === 1 && isNaN(item)) {
        alphabets.push(item);
        if (
          !highest_alphabet ||
          item.toLowerCase() > highest_alphabet.toLowerCase() // Fix comparison for lowercase
        ) {
          highest_alphabet = item;
        }
      }
    }

    // File processing logic
    let fileIsValid = false;
    let mimeType = null;
    let fileSizeKB = 0;

    // Check if base64 string starts with "data:" or not
    if (fileB64) {
      if (fileB64.startsWith("data:")) {
        fileIsValid = true;
        mimeType = fileB64.split(';')[0].split(':')[1]; // Extract MIME type from data URI
      } else {
        fileIsValid = true;
        mimeType = "unknown"; // No MIME type in this case
      }

      // Calculate file size
      fileSizeKB = Buffer.byteLength(fileB64, 'base64') / 1024; // Calculate size in KB
    }

    res.json({
      is_success: true,
      user_id: "parshva_14032003",  // Hardcoded user ID
      email: "pp2397@srmist.edu.in", // Hardcoded email
      roll_number: "RA2111003010725", // Hardcoded roll number
      numbers: numbers,
      alphabets: alphabets,
      highest_alphabet: highest_alphabet ? [highest_alphabet] : [],
      file_info: {
        is_valid: fileIsValid,
        mime_type: mimeType,
        size_kb: fileSizeKB.toFixed(2), // Round file size to two decimal places
      },
    });
  });

// Use the PORT from the .env file or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
