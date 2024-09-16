const db = require('../db');

// Upload an image
exports.uploadImage = async (req, res) => {
  const { image } = req.body;  // Image path from the request

  try {
    // Insert the image into the images table
    const [result] = await db.execute(
      'INSERT INTO images (image_path) VALUES (?)',
      [image]
    );

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
};

// Get an image by ID
exports.getImageById = async (req, res) => {
  const { id } = req.params;

  try {
    // Modify the query to join images and articles table
    const [image] = await db.execute(`
      SELECT images.id AS image_id, images.image_path, images.article_id, articles.title, articles.content
      FROM images
      LEFT JOIN articles ON images.article_id = articles.id
      WHERE images.id = ?
    `, [id]);

    if (image.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Return the image with associated article details
    res.status(200).json({ image: image[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error });
  }
};
