const mongoose = require('mongoose');
const Schema = mongoose.Schema
const friendsSchema = new Schema({
    name: String,
    age: Number,
    email: String
})

const Friend = mongoose.model("Friend",friendsSchema);

module.exports = Friend;
//CRUD OPERATIONS CREATE READ/GET UPDATE DELETE
