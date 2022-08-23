const User = require('../models/User');

const userController = {
    // get all users
    getUsers(req, res) {
        User.find()
        .then((users) => res.json(users))
        .catch((err) => {
            console.error({ message: err });
            res.status(500).json(err)
        });
    },

    // get user by id 
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.id })
        .then((user) => {
            if(!user) {
                res.status(404).json({ message: 'No user found with this ID!' });
                return;
            }
            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // create new user
    createUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    // update existing user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((dbUserData) => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // delete user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));
    },

    // add friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            { new: true }
        )
        .then((friend) => {
            !friend 
                ? res.status(404).json({ message: 'No friend found with this ID!' })
                : res.json(friend);
        })
        .catch((err) => res.status(500).json(err));
    },

    // delete friend
    deleteFriend(req, res)  {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then((dbFriendData) => {
                if (!dbFriendData) {
                res.status(404).json({ message: 'No friend found with this ID!' });
                return;
                }
                res.json(dbFriendData);
            })
            .catch((err) => res.status(500).json(err));
    },
};

module.exports = userController;
    