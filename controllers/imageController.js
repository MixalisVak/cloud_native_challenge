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
      const [image] = await db.execute('SELECT * FROM images WHERE id = ?', [id]);
  
      if (image.length === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      res.status(200).json({ image: image[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching image', error });
    }
};
