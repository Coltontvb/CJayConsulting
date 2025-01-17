require(`dotenv`).config();
const express = require(`express`);
const app = express();
const path = require(`path`);
const bodyParser = require(`body-parser`);
const port = process.env.PORT || 3001;

//Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//Routes
const staticRouter = require(`./routes/static`);
const paymentsRouter = require(`./routes/payment`);
app.use(`/payment`, paymentsRouter);
app.use(`/`, staticRouter);
app.use(`/web-sol`, staticRouter);
app.use(`/hardware-req`, staticRouter);

//Run up server with npm start or nodemon server.js
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

module.exports = app;