import { Admin } from "../models/adminModel.js";

// Login Controller
// export const loginAdmin = async (req, res) => {
//   const { username, password } = req.body;
//   console.log(username, password);

//   // Check if username and password are provided
//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ message: "Username and password are required" });
//   }

//   try {
//     // Find admin by username
//     let admin = await Admin.findOne({ username });

//     // If admin doesn't exist, create a new admin
//     if (!admin) {
//       console.log("--> Admin not found, creating a new one");

//       // Create new admin (password will be hashed by the pre-save hook)
//       const newAdmin = new Admin({
//         username,
//         password, // Just pass the plain password, it will be hashed automatically
//       });

//       // admin = newAdmin;

//       // Save the new admin to the database
//       await newAdmin.save();

//       // After creating the new admin, log in successfully
//       const accessToken = admin.generateAccessToken();
//       const refreshToken = admin.generateRefreshToken();
//       admin.refreshToken = refreshToken;

//       await admin.save();

//       // Return success message with tokens
//       return res.status(200).json({
//         accessToken,
//         refreshToken,
//         message: "Admin created and logged in successfully",
//       });
//     }

//     // If admin exists, check if the password is correct
//     const isPasswordValid = await admin.isPasswordCorrect(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate access token
//     const accessToken = admin.generateAccessToken();

//     // Generate refresh token
//     const refreshToken = admin.generateRefreshToken();

//     // Save refresh token to the admin document in the database
//     admin.refreshToken = refreshToken;
//     await admin.save();

//     // Send tokens as a response
//     res.status(200).json({
//       accessToken,
//       refreshToken,
//       message: "Login successful",
//     });
//   } catch (error) {
//     console.error("Login error: ", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// Signup API
export const signupAdmin = async (req, res) => {
  const { email, password, phone, gender,country } = req.body;

  // Validate required fields
  if (!email || !password || !phone || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new admin (password will be hashed by the pre-save hook)
    admin = new Admin({
      email,
      password, // Plain password, will be hashed automatically
      phone,
      gender,
    });

    // Save the new admin to the database
    await admin.save();

    res.status(201).json({
      admin,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error("Signup error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login API
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  // Validate required fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });

    // If admin doesn't exist, return an error
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    console.log('abhishek')
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log('kumar')
    // Generate tokens
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // Save the refresh token to the admin document in the database
    admin.refreshToken = refreshToken;
    await admin.save();

    // Send tokens as a response
    res.status(200).json({
      accessToken,
      refreshToken,
      admin,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const handleServerError = (res, error, message) => {
  res.status(500).json({ message, error });
};

