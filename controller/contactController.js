
//  import models
const Contact = require("../models/contact");

// create contact method
exports.createContact = async (req, res) =>{
    try{
        const { name, email,subject, message } = req.body;

        if(!name || !email || !subject || !message){
            return res.status(400).json({message: "All fields are required."})
        }

        const newContact = new Contact({
            name, 
            email,
            subject,
            message
        });

        await newContact.save();

        res.status(201).json({
            message: "Message sent successfully",
            data: newContact
        });

    }catch(error){
        res.status(500).json({
            message: "Server error", error
        });

    }
}