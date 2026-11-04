const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.post('/items/:id/comments', (req, res) => {
  const { comment } = req.body;
  const success = Item.addComment(req.params.id, comment);
  
  if (success) {
    res.json({ success: true, message: 'Comment added' });
  } else {
    res.status(404).json({ success: false, message: 'Item not found' });
  }
});

module.exports = router;
