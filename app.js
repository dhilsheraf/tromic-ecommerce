const express = require('express') ;
const app = express();
const path = require('path');
const connectDB = require("./config/config")
const userRoute = require("./routes/userRoute")
const adminRoute = require("./routes/adminRoute")
const session = require('express-session')
require('dotenv').config()
const bodyParser = require('body-parser'); 
const passport = require("./config/passport")
const cloudinary = require('cloudinary').v2;


const  PORT = process.env.PORT || 8080; 

app.use(express.json())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,  
        httpOnly:true,
        maxAge:72*60*60*1000
    }
})) 

app.use(passport.initialize());
app.use(passport.session()) 

app.set('view engine','ejs')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/products', express.static('uploads/products'));
 
 
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views')); 
app.use(express.urlencoded({ extended: true }));

connectDB()  
  



// Configure Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


 
app.use('/',userRoute) ;
app.use('/admin',adminRoute)
app.get('/test',(req,res)=>{
    res.render('user/single-product')
})
 
app.listen(PORT,()=>
console.log(`Server is running on http://localhost:${PORT}`), 
)                   