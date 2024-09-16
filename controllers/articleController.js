const db = require('../db');

// Create a new article
exports.createArticle = async (req, res) => {
  const { title, content, image } = req.body;

  try {
      // Step 1: Insert the article into the articles table
      const [articleResult] = await db.execute(
          'INSERT INTO articles (title, content) VALUES (?, ?)',
          [title, content]
      );

      const articleId = articleResult.insertId; // Get the ID of the newly created article
      let imageId = null;

      // Step 2: Insert the image into the images table with the article ID
      if (image) {
          const [imageResult] = await db.execute(
              'INSERT INTO images (image_path, article_id) VALUES (?, ?)',
              [image, articleId]
          );
          imageId = imageResult.insertId; // Get the ID of the newly inserted image
      }

      res.status(201).json({
          message: 'Article and image created successfully',
          article_id: articleId,
          image_id: imageId
      });
  } catch (error) {
      res.status(500).json({ message: 'Error creating article', error });
  }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
      const [articles] = await db.execute(`
          SELECT articles.id AS article_id, articles.title, articles.content, images.id AS image_id, images.image_path
          FROM articles
          LEFT JOIN images ON articles.id = images.article_id
      `);

      if (articles.length === 0) {
          return res.status(404).json({ message: 'No articles found' });
      }

      const response = articles.map(article => ({
          article_id: article.article_id,
          title: article.title,
          content: article.content,
          image: {
              image_id: article.image_id,
              image_path: article.image_path
          }
      }));

      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching articles', error });
  }
};

// Get a single article by ID
exports.getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
      // Fetch the article by its ID
      const [article] = await db.execute(
          'SELECT articles.id AS article_id, articles.title, articles.content, images.id AS image_id, images.image_path FROM articles LEFT JOIN images ON articles.id = images.article_id WHERE articles.id = ?',
          [id]
      );

      if (article.length === 0) {
          return res.status(404).json({ message: 'Article not found' });
      }

      res.status(200).json({
          article_id: article[0].article_id,
          title: article[0].title,
          content: article[0].content,
          image: {
              image_id: article[0].image_id,
              image_path: article[0].image_path
          }
      });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching article', error });
  }
};


// Note:
// In the current implementation, when updating an article, we don't pass the image ID in the request,
// so there's no way to identify which existing image we are updating. As a result, every time an article
// is updated with a new image path, a new image is inserted into the `images` table, even if an image 
// already exists for that article.
//
// This effectively creates a new image each time an article is updated, rather than updating an existing one.
// Because of this, we are not able to associate multiple images with an article in this setup. 
// The current logic only allows one image to be linked to an article, and it replaces the old image each time 
// a new one is added by deleting the previous image and inserting a new one.
//
// In this approach, an article can only have one image at a time, as we're not retaining multiple images for 
// an article.


// Update an existing article
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, image } = req.body;

  try {
      // Step 1: Update the article's title and content
      const [articleResult] = await db.execute(
          'UPDATE articles SET title = ?, content = ? WHERE id = ?',
          [title, content, id]
      );

      if (articleResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Article not found' });
      }

      let imageId = null;

      // Step 2: Update the associated image (if provided)
      if (image) {
          // Optionally: Delete the old image associated with the article
          await db.execute('DELETE FROM images WHERE article_id = ?', [id]);

          // Insert the new image into the images table
          const [imageResult] = await db.execute(
              'INSERT INTO images (image_path, article_id) VALUES (?, ?)',
              [image, id]
          );
          imageId = imageResult.insertId; // Get the new image ID
      }

      res.status(200).json({
          message: 'Article and image updated successfully',
          article_id: id,
          image_id: imageId
      });
  } catch (error) {
      res.status(500).json({ message: 'Error updating article', error });
  }
};

  // Delete an article by ID
exports.deleteArticle = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the associated images first
        await db.execute('DELETE FROM images WHERE article_id = ?', [id]);

        // Then delete the article
        const [articleResult] = await db.execute('DELETE FROM articles WHERE id = ?', [id]);

        if (articleResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({ message: 'Article and associated images deleted successfully', article_id: id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting article', error });
    }
};