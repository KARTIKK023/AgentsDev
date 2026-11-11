import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const createConversation = async (req , res) => {
    try {
        const userId = req.headers["x-user-id"]
        const conversation = await Conversation.create({
            userId:userId
        })

        return res.status(200).json(conversation)

    } catch (error) {
        return res.status(500).json(`error in createConversaton ${error}`)
    }
}

export const getConversations = async (req , res) => {
    try {
        const userId = req.headers["x-user-id"]
        const conversations = await Conversation.find({
            userId:userId
        }).sort({updatedAt:-1})

        return res.status(200).json(conversations)

    } catch (error) {
        return res.status(500).json(`error in getConversaton ${error}`)
    }
}

export const updateConversation = async (req, res) => {
    try {
        const{id, title} = req.body
        const conversation = await Conversation.findByIdAndUpdate(
            id,
            {title},
            {new:true}
        )

        return res.status(200).json(conversation)
    } catch (error) {
         return res.status(500).json(`error in updateConversation ${error}`)
    }
}

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params
        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID is required" })
        }
        const conversation = await Conversation.findByIdAndDelete(conversationId)
        const messages = await Message.deleteMany({ conversationId });

        return res.status(200).json(conversation, messages)
    } catch (error) {
        return res.status(500).json(`error in deleteConversation ${error}`)
    }
}

export const saveMessage =async (req ,res) => {
    try {
        const {conversationId , role , content} = req.body
        const message = await Message.create({
            conversationId,
            role,
            content
        })
        return res.status(200).json(message)
    } catch (error) {
         return res.status(500).json(`error in saveMessage ${error}`)
    }
}

export const getMessages =async (req ,res) => {
    try {
        const { conversationId } = req.params
        const messages = await Message.find({
            conversationId: conversationId
        }).sort({createdAt:1})
        return res.status(200).json(messages)
    } catch (error) {
         return res.status(500).json(`error in getMessages ${error}`)
    }
}

