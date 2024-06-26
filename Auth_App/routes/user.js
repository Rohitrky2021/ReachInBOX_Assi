// const express = require("express");
// const router = express.Router();

// const User = require("../models/User");

// const {login, signup} = require("../Controllers/Auth");
// const {auth, isStudent,isAdmin} = require("../middlewares/auth");

// router.post("/login", login);
// router.post("/signup", signup);

// //testing protected routes for single middleware
// router.get("/test", auth, (req,res) =>{
//     res.json({
//         success:true,
//         message:'Welcome to the Protected route for TESTS',
//     });
// });

// //Protected Route
// router.get("/student", auth, isStudent, (req,res) => {
//     res.json({
//         success:true,
//         message:'Welcome to the Protected route for Students',
//     });
// } );

// router.get("/admin", auth, isAdmin, (req,res) => {
//     res.json({
//         success:true,
//         message:'Welcome to the Protected route for Admin',
//     });
// });

 
// module.exports = router;



const express = require('express');
const bodyParser = require('body-parser');
const { connectGmail, handleGmailCallback, handleGmailWebhook } = require('./controllers/gmailController');
const { connectOutlook, handleOutlookCallback, handleOutlookWebhook } = require('./controllers/outlookController');
const { processGmail, processOutlook, handleIncomingEmail } = require('./controllers/emailController');

const app = express();
app.use(bodyParser.json());

app.get('/auth/gmail', connectGmail);
app.get('/auth/gmail/callback', handleGmailCallback);
app.post('/webhook/gmail', handleGmailWebhook);

app.get('/auth/outlook', connectOutlook);
app.get('/auth/outlook/callback', handleOutlookCallback);
app.post('/webhook/outlook', handleOutlookWebhook);

app.post('/process/gmail', processGmail);
app.post('/process/outlook', processOutlook);

app.post('/incoming-email', handleIncomingEmail);

module.exports = app;
