import UserInteractions from "../models/UserInteractions.js"
import Books from "../models/Books.js"

export const recommendProducts = async (userId) => {
	  // Get user interactions (e.g., books they viewed or purchased)
	  const interactions = await UserInteractions.find({ userId });

	  // Get details of the books they interacted with
	  const booksId = interactions.map(interaction => interaction.productId);
	  const books = await Books.find({ _id: { $in: booksId } });

	  // Extract categories or tags from these books
	  const categories = books.map(book => book.category);

	  // Find other books in the same categories
	  const recommendations = await Books.find({
	    category: { $in: categories },
	    _id: { $nin: booksId }, // Exclude already viewed/purchased books
	  });

	  return recommendations;
}

  const recommendProductsCollaborative = async (userId) => {
  // Get users with similar interests or purchase history
  const similarUsers = await UserInteractions.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$bookId",
        similarUsers: { $addToSet: "$userId" },
      },
    },
  ]);

// Get products these similar users have purchased
const recommendedBooks = await UserInteractions.aggregate([
    { $match: { userId: { $in: similarUsers.similarUsers } } },
    {
      $group: {
        _id: "$bookId",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } }, // Sort by most popular products among similar users
  ]);

  const recommendations = await Books.find({
    _id: { $in: recommendedBooks.map((r) => r._id) },
 });

  return recommendations;
}