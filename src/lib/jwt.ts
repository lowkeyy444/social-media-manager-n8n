import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

// Generate JWT
export const generateToken = (user: { id: string; email: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "7d" }
  );
};

// Verify JWT
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded; // { id, email, iat, exp }
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
};

