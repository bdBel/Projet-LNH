const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./config/db');  // Adjust path as needed

require('dotenv').config();

const cors = require('cors');



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRoutes');
const equipeRoutes = require('./routes/equipeRoutes');
const joueurRoutes = require('./routes/joueurRoutes');
const liveScoreRoutes = require('./routes/index');
const boxScoreRoutes = require('./routes/boxScoreRoutes');


//Route vers statitique
const statistiqueGardienRoutes = require('./routes/statistiqueGardienRoutes');
const statistiqueEquipeRoutes = require('./routes/statistiqueEquipeRoutes');
const statistiqueJoueurRoutes = require('./routes/statistiqueJoueurRoutes');

const app = express();
connectDB();  
// view engine setup
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', equipeRoutes);
app.use('/', joueurRoutes);
app.use('/', liveScoreRoutes);
app.use('/game', boxScoreRoutes);

// Routes des statistiques
app.use('/stats/gardien', statistiqueGardienRoutes);
app.use('/stats/equipe', statistiqueEquipeRoutes);
app.use('/stats/joueur', statistiqueJoueurRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
module.exports = app;
