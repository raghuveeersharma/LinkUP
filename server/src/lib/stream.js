import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("api key and secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (err) {
    console.log("error in upsertUser", err);
  }
};
export const deleteStreamUser = async (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    await streamClient.deleteUser(userIdStr);
    console.log("Stream user deleted successfully:", userIdStr);
  } catch (err) {
    console.log("error in deleteStreamUser", err);
  }
};
export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};
