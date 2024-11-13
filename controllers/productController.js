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
    const { name, description, price, stock, category } = req.body;
    const primaryImage = req.body.primaryImage;
    const additionalImages = req.body.additionalImages;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            category,
            primaryImage,
            additionalImages,
        });
        console.log(primaryImage);
        console.log(additionalImages);
        

        await newProduct.save();
        res.redirect('/admin/products');  // Redirect after saving the product
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: "Error saving product to database" });
    }
}

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
        const { name, description, price, stock, category } = req.body;

        // Handle primary image upload if available
        let primaryImage = req.file ? await handleImageUpload(req.file) : null;

        // Handle additional images upload if available
        let additionalImages = [];
        if (req.files && req.files.additionalImages) {
            for (let file of req.files.additionalImages) {
                const imageUrl = await handleImageUpload(file);
                additionalImages.push(imageUrl);
            }
        }

        // Find the product and update
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            {
                name,
                description,
                price,
                stock,
                category,
                primaryImage: primaryImage || undefined, // Only update if provided
                additionalImages: additionalImages.length > 0 ? additionalImages : undefined
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }

        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

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