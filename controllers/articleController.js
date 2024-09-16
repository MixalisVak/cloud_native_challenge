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

    // Step 2: Retrieve the articleId from the result of the article insert
    const articleId = articleResult.insertId;  // The newly created article's ID

    // Step 3: Insert the associated image into the images table with the correct articleId
    const [imageResult] = await db.execute(
      'INSERT INTO images (image_path, article_id) VALUES (?, ?)',
      [image, articleId]  // Use the articleId from the previous insert
    );

    res.status(201).json({
      message: 'Article and image created successfully',
      articleId: articleId,
      imageId: imageResult.insertId
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
      console.log('article', article)
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
        'INSERT INTO images (image_path, article_id) VALUES (?, ?)',
        [image, id] // `articleId` is the id of the article associated with the image
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