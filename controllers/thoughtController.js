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
        .then(({_id}) => {
            return User.findOneAndUpdate(
                { username: req.body.username},
                { $push: { thoughts: _id} },
                { runValidators: true, new: true }
            );
        })
        .then((thought) => res.json(thought))
        .catch((error) => (res.status(500).json(error)));
    },

    // update existing thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought found with this ID!' })
                : res.json(thought)
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
                ? res.status(404).json({ message: 'No thought found with this ID!' })
                : User.findOneAndUpdate(
                    { thoughts: req.params.videoId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                )
        )
        .then((user) =>
            !user
                ? res
                    .status(404)
                    .json({ message: 'Thought created but no user found with this id.'})
                : res.json({ message: 'Thought successfully deleted!' })
        )
        .catch((err) => res.status(500).json(err));
    },

    // add reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then((thought) => 
            !thought 
                ? res.status(404).json({ message: 'No thought found with this ID!' })
                : res.json(thought)
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
        .then((thought) => 
            !thought 
                ? res.status(404).json({ message: 'No thought found with this ID!' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};

module.exports = thoughtController;