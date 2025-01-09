const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const equipeRoutes = require('./routes/equipeRoutes');
//Route vers statitique
const statistiqueGardienRoutes = require('./routes/statistiqueGardienRoutes');
const statistiqueEquipeRoutes = require('./routes/statistiqueEquipeRoutes');
const statistiqueJoueurRoutes = require('./routes/statistiqueJoueurRoutes');

const app = express();

// view engine setup
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

// Routes des statistiques
app.use('/gardien', statistiqueGardienRoutes);
app.use('/equipe', statistiqueEquipeRoutes);
app.use('/joueur', statistiqueJoueurRoutes);



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
  console.log('Serveur démarré sur http://localhost:3030');
});
module.exports = app;
