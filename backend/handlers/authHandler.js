import userSchema from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Configure transporter (use environment variables)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // example: yourname@gmail.com
    pass: process.env.EMAIL_PASS, // app password from Gmail
  },
});

/* ---------------------- SIGN UP ---------------------- */
export async function signUp(req, res) {
  try {
    const { email, password, username, cpassword, phone, profile } = req.body;

    if (!(email && username && password && cpassword && phone && profile)) {
      return res.status(400).send({ msg: "All fields are required" });
    }

    if (password !== cpassword) {
      return res.status(400).send({ msg: "Passwords do not match" });
    }

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userSchema.create({
      email,
      username,
      password: hashedPassword,
      phone,
      profile,
    });

    return res.status(201).send({ msg: "success" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send({ msg: "Server error" });
  }
}

/* ---------------------- SIGN IN ---------------------- */
export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send({ msg: "Fields are empty" });
    }

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).send({ msg: "Invalid email" });
    }

    const success = await bcrypt.compare(password, user.password);
    if (!success) {
      return res.status(401).send({ msg: "Email or password is invalid" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "24h",
    });

    return res.status(200).send({
      msg: "Successfully logged in",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).send({ msg: "Server error" });
  }
}

/* ---------------------- FORGOT PASSWORD ---------------------- */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });

    const resetUrl = `http://localhost:5173/newpassword?token=${resetToken}`;

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #ddd;padding:20px;border-radius:8px;text-align:center;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to change your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#4CAF50;color:#fff;text-decoration:none;padding:12px 24px;margin-top:20px;border-radius:4px;">Change Your Password</a>
      </div>
    `;

    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: htmlBody,
    });

    return res.status(200).send({ msg: "Password reset email sent", email });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).send({ msg: "Server error" });
  }
}

/* ---------------------- CHANGE PASSWORD ---------------------- */

export async function changePassword(req, res) {
  try {
    const { email, npassword, cpassword } = req.body;

    // 1️⃣ Validate inputs
    if (!email || !npassword || !cpassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 2️⃣ Check if user exists
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ Validate new password match
    if (npassword !== cpassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // 4️⃣ Prevent reusing the same password
    const isSamePassword = await bcrypt.compare(npassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ msg: "New password cannot be the same as the old one" });
    }

    // 5️⃣ Hash and update password
    const hashedPassword = await bcrypt.hash(npassword, 10);
    await userSchema.updateOne({ email }, { $set: { password: hashedPassword } });

    // 6️⃣ Respond success
    return res.status(201).json({ msg: "Password changed successfully" });
  } catch (error) {
    console.error("❌ Change password error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

