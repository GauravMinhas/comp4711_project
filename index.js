const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login/LoginRoutes');
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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false,
}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(loginRoutes);
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${config.hostname}:${config.port}/`);
});
