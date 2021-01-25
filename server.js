const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload')
const errorHandler = require('./middleware/error')

const connectDB = require('./config/db')
//Loa env vars
dotenv.config({ path: './config/config.env'})
//Connect to database
connectDB();
//Route files
const bootcamps = require('./routers/bootcamps');
const courses = require('./routers/courses');
const auth = require('./routers/auth');
const users = require('./routers/users');
const reviews = require('./routers/reviews');

const app = express();

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());


//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//File uploading 
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);



const PORT = process.env.PORT || 7000
const server = app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
  );
  
  //Handle unhandle promise rejection
  
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.red.underline)
    //Close server & exit process
  
    server.close(() => process.exit(1))
  })