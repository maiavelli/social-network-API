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
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    // update existing thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this ID!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // delete thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this ID!' });
                return;
            }
            res.json(dbThoughtData);
        })
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
    deleteFriend(req, res)  {
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