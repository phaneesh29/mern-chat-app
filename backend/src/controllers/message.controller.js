import { MessageModel } from "../models/message.model.js";
import { UserModel } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const getUsersForSidebarController = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await UserModel.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getMessageController = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await MessageModel.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const sendMessageController = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await MessageModel.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        //chat-realtime

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const deleteMessageController = async (req, res) => {
    try {
        const { id: messageId } = req.params
        const userId = req.user._id
        if (!messageId) {
            return res.status(400).json({ message: "No messageId given" })
        }
        const message = await MessageModel.findOne({ _id: messageId, senderId: userId })
        if (!message) {
            return res.status(400).json({ message: "You dont have permission to delete this message" })
        }
        const deletedMessage = await MessageModel.findOneAndDelete({ _id: messageId, senderId: userId })

        res.status(200).json({ message: "message deleted successfully", deletedMessage });

    } catch (error) {
        console.log("Error in deleteMessage controller: ", error.message);
        res.status(500).json({ error: error.message });
    }

}
