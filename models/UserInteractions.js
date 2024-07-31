const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  interactionType: { type: String, enum: ['view', 'click', 'add_to_cart', 'purchase', 'search'] },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  searchQuery: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
});

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

module.exports = UserInteraction;