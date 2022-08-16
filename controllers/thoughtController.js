const { User, Thought } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .then((thoughts) => res.json(thoughts))
        .catch((err) => {
            console.error({ message: err });
            res.status(500).json(err);
        });
    },

    // get thought by id 
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((thought) => {
            if(!thought) {
                res.status(404).json({ message: 'No thought found with this ID!' });
                return;
            }
            res.json(thought);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create new thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId},
                { $addToSet: { videos: video._id} },
                { new: true }
            );
        })
        .then((user) => 
            !user
                ? res.status(404).json({
                    message: 'Thought created, but found no user with that ID.'
                })
                : res.json('Thought created 🎉'))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // update existing thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) => {
            !thought
                ? res.status(404).json({ message: 'No thought found with this ID!' });
                ! res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // delete thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought found with this ID!' });
                ! User.findOneAndUpdate(
                    { thoughts: req.params.videoId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                )
        )
        .then((user) =>
            !user
                ? res
                    .status(404)
                    .json({ message: 'Thought created but no user found with this id.'}))
                : res.json({ message: 'Thought successfully deleted!' })
        )
        .catch((err) => res.status(500).json(err));
    },

    // add reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        )
        .then((dbReactionData) => 
            !dbReactionData 
                ? res.status(404).json({ message: 'No reaction found with this ID!' })
                : res.json(dbReactionData)
        )
        .catch((err) => res.status(500).json(err));
    },

    // delete reaction
    deleteReaction(req, res)  {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactionId: req.params.reactionId } },
            { runValidators: true, new: true }
        )
        .then((dbReactionData) => 
            !dbReactionData 
                ? res.status(404).json({ message: 'No reaction found with this ID!' })
                : res.json(dbReactionData)
            )
            .catch((err) => res.status(500).json(err));
    },
};

module.exports = thoughtController;