// src/app/api/auth/signin/route.js
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "No user found" }, { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    const token = generateToken({ id: user._id.toString(), email: user.email });

    return NextResponse.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signin API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}