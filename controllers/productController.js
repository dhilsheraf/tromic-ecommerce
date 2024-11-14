const Product = require('../models/productModel');
const Category = require('../models/categoryModel')

const getProduct =   async (req, res) => {
    try {
        const products = await Product.find({}).populate('category');
        res.render('admin/product',{products})
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).render('admin/404');
    }
};
 
const loadAddProduct = async (req,res) =>{
      try {
        const categories = await Category.find({ isActive: true });
        res.render('admin/addProduct', { categories });
      } catch (error) {
        console.error('Error loading add product page:', error);
        res.status(500).render('admin/404');
      }
}

const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        // Retrieve image URLs from Cloudinary (from req.files)
        const images = req.files.map(file => file.path);  // Assuming multer uploads the images to Cloudinary

        // Create new product
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            category,
            images,  // Store Cloudinary image URLs
        });

        // Save the product to the database
        await newProduct.save();

        // Respond with success or redirect
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while adding product');
    }
};

const loadEditProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        const categories = await Category.find(); // Fetch all categories

        // Render the editProduct view, passing both product and categories
        res.render('admin/editProduct', { product, categories });
    } catch (error) {
        console.error("Error loading product for edit:", error);
        res.status(500).json({ error: "Failed to load product for editing" });
    }

}


const editProduct = async (req, res) => {
    try {
        const { product_id, name, description, price, stock, category, existingImages } = req.body;

        // Get the indexes of the images that need to be replaced
        const imageIndexes = req.body.imageIndexes.map(index => parseInt(index, 10));
        const images = [...existingImages]; // Start with existing images

        // Map new uploaded images to their specified indexes
        req.files.forEach((file, idx) => {
            const imageIndex = imageIndexes[idx];
            images[imageIndex] = file.path; // Replace image at this index
        });

        // Update the product in the database
        await Product.findByIdAndUpdate(product_id, {
            name,
            description,
            price,
            stock,
            category,
            images,
        });

        res.redirect('/admin/products');
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to edit product" });
    }
};




// const deleteProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const product = await Product.findByIdAndUpdate(productId, { isDeleted: true }, { new: true });
//         if (!product) return res.status(404).json({ message: 'Product not found' });
//         res.json({ message: 'Product soft deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };




module.exports = {
    addProduct,
    loadEditProduct,
    editProduct,
    // deleteProduct,
    getProduct,
    loadAddProduct
}