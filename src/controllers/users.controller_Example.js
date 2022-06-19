const userCtrl = {};

const User = require("../models/user");

userCtrl.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

userCtrl.createUser = async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.send({message: "User created"});
};

userCtrl.getUser = async (req, res) => {
    // console.log(req.params);
    // const user = await User.findOne({_id: req.params.id});
    const user = await User.findById(req.params.id);
    res.send(user);
};

userCtrl.updateUser = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({message: "User updated"});
};

userCtrl.getUser = async (req, res) => {
    // console.log(req.params);
    // const employee = await Employee.findOne({_id: req.params.id});
    const user = await User.findById(req.params.id);
    res.send(user);
};

userCtrl.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send({message: "User deleted"});
};

module.exports = userCtrl;