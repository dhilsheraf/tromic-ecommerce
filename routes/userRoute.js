const express = require('express');
// const User = require('../models/userModel') ;
const userController = require('../controllers/userController')
const passport = require("passport")
const router = express();
const { checkUserSession } = require('../middleware/authMiddleware');


router.set("view engine", "ejs");
router.set("views", "./views/user");

//otp routes



 
//home about etc
router.get("/",userController.loadHome) ;

router.get("/about",userController.loadAbout)

router.get("/blog",userController.loadBlog);

router.get("/contact",userController.loadContact);

router.get("/my-account",userController.loadMyAccount)

router.get("/wishlist",checkUserSession,userController.loadWishlist)

// sign up
router.get("/signup",userController.loadSignup)
router.post("/signup",userController.signUp)

//login
router.get("/login",userController.loadLogin) ;
router.post("/login",userController.login)

//google authentication
router.get("/auth/google",passport.authenticate('google',{scope:['profile','email']}))
router.get("/auth/google/callback",passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
    res.redirect('/')
})
//otp
router.post("/verify-otp",userController.verifyOTP)
router.post("/resend-otp",userController.resendOTP)

//page not found
router.get("/pageNotFound",userController.pageNotFound)

//logout
router.get("/logout",userController.logout)

router.get("/products",userController.loadProduct)
router.get('/product/:id', userController.getProductDetails);


module.exports = router ;  
   