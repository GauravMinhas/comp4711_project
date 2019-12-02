const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser')
const userAuthRoutes = require('./routes/userAuthRouter');
const postRoutes = require('./routes/postRouter');
const mainPageRoutes = require('./routes/mainPageRouter');
const userProfileRoutes = require('./routes/userProfileRouter')
const messagesRoutes = require('./routes/messagesRouter')
const config = require('./config/config');

const app = express();

app.engine(
  'hbs', hbs({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs',
  }),
);
app.set('view engine', 'hbs');

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  }),
);
app.use(cookieParser())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false,
}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(userAuthRoutes);
app.use(postRoutes);
app.use(mainPageRoutes);
app.use(userProfileRoutes);
app.use(messagesRoutes);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${config.hostname}:${config.port}/`);
});
