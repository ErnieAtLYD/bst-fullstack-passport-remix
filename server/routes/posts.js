const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Get all posts route
router.get('/', (req, res) => {
  Post.findAll()
    .then((posts) => {
      let updatedPosts = posts;

      // Check if user is logged in and update all logged in user's posts with "isCurrentUser" field
      if (req.user) {
        updatedPosts = updatedPosts.map((post) => {
          return {
            ...post,
            isCurrentUser: post.user_id === req.user.id,
          };
        });
      }
      res.status(200).json(updatedPosts);
    })
    .catch(() => {
      res.status(500).json({ message: 'Error fetching posts' });
    });
});

// Create a new post route
router.post('/', (req, res) => {
  // If user is not logged in, we don't allow them to create a new post
  if (req.user === undefined)
    return res.status(401).json({ message: 'Unauthorized' });

  // Validate request body for required fields
  if (!req.body.title || !req.body.content) {
    return res
      .status(400)
      .json({ message: 'Missing post title or content fields' });
  }

  // Insert new post into DB: user_id comes from session, title and content from a request body
  // In our model at models/post.js, we made create so it returns the row we just created
  Post.create({
    user_id: req.user.id,
    title: req.body.title,
    content: req.body.content,
  })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch(() => {
      res.status(500).json({ message: 'Error creating a new post' });
    });
});

// Export this module
module.exports = router;
