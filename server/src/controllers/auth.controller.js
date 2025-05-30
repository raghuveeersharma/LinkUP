import { upsertStreamUser, deleteStreamUser } from "../lib/stream.js";
import FriendRequest from "../models/friendRequest.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export async function signup(req, res) {
  const { fullName, email, password } = req.body;
  // check if user already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a diffrent one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });
    // create stream user
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log("stream user created");
    } catch (err) {
      console.log("error in creating stream user", err);
    }
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // prevent xss attacks
      secure: true,
      sameSite: "none", // prevent CSRF attacks
    });
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: { newUser },
    }); // send token in cookie
  } catch (error) {
    console.log("error in signup controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Invalid credentials, please try again" });
    }
    // check if password is correct
    const isPassMatch = await existingUser.matchPassword(password);
    if (!isPassMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials, please try again" });
    }
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    // send token in cookie
    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // prevent xss attacks
      secure: true,
      sameSite: "none", // prevent CSRF attacks
    });
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: { existingUser },
    });
  } catch (error) {
    console.log("error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true, // required for HTTPS (Render is HTTPS)
    sameSite: "None", // required for cross-origin cookies
  });

  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteAccount(req, res) {
  try {
    const userId = req.user._id;

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Delete all related friend requests
    await FriendRequest.deleteMany({
      $or: [{ sender: userId }, { recipient: userId }],
    });

    //  remove this user from friends arrays of others
    await User.updateMany({ friends: userId }, { $pull: { friends: userId } });

    //  Delete from Stream (if using)
    try {
      await deleteStreamUser(deletedUser._id.toString());
      console.log(`Stream user deleted after deleting account`);
    } catch (streamError) {
      console.log(
        "Error deleting Stream user during account deletion:",
        streamError.message
      );
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
