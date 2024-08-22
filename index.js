const express = require('express');
const connectDB =  require('./src/config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const corsOptions = require('./src/config/corsConfig');
const cookieParser = require('cookie-parser');

//Load env variables
dotenv.config();

//Initialize express
const app = express();  
//Connect to DB    
connectDB();  
//CORS  
app.use(cors(corsOptions));  


//Middleware        
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

//Routes
const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const astaffRoutes = require('./src/routes/aStaffRoutes');
const nAstaffRoutes = require('./src/routes/nAStaffRoutes');
const managementRoutes = require('./src/routes/managementRoutes');
const userRoutes = require('./src/routes/userRoutes');

//Use routes

app.use('/api/auth', authRoutes);   
app.use('/api/student', studentRoutes);
app.use('/api/academicStaff', astaffRoutes);
app.use('/api/nonAcademicStaff', nAstaffRoutes);
app.use('/api/management', managementRoutes);
app.use('/api/user', userRoutes);

// Error handling
const errorHandler = require('./src/utils/errorHandler');
app.use(errorHandler);  
       

// Start the server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))           