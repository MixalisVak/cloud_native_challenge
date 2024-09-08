const db = require('../db');

// Create a new article
exports.createArticle = async (req, res) => {
    const { title, content, image } = req.body;  // Using image path
  
    try {
      // Insert the image into the images table
      const [imageResult] = await db.execute(
        'INSERT INTO images (image_path) VALUES (?)',
        [image]
      );
  
      const imageId = imageResult.insertId;  // Get the image_id from the insertion
  
      // Insert the article with the associated image_id
      const [articleResult] = await db.execute(
        'INSERT INTO articles (title, content, image_id) VALUES (?, ?, ?)',
        [title, content, imageId]
      );
  
      res.status(201).json({
        message: 'Article created successfully',
        articleId: articleResult.insertId
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating article', error });
    }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
    try {
      const [articles] = await db.execute('SELECT * FROM articles');
  
      res.status(200).json({ articles });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching articles', error });
    }
};

// Get a single article by ID
exports.getArticleById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [article] = await db.execute('SELECT * FROM articles WHERE id = ?', [id]);
  
      if (article.length === 0) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      res.status(200).json({ article: article[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching article', error });
    }
};

// Update an existing article
exports.updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content, image } = req.body;
  
    try {
      // Update the image in the images table
      // This creates a new image in the table. For this implementation it's fine. But in a big project, this could lead to duplicates records.
      const [imageResult] = await db.execute(
        'INSERT INTO images (image_path) VALUES (?)',
        [image]
      );
  
      const imageId = imageResult.insertId;
  
      // Update the article with the new image_id
      const [result] = await db.execute(
        'UPDATE articles SET title = ?, content = ?, image_id = ? WHERE id = ?',
        [title, content, imageId, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      res.status(200).json({ message: 'Article updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating article', error });
    }
};  

  // Delete an article by ID
exports.deleteArticle = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.execute('DELETE FROM articles WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting article', error });
    }
};