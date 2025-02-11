require('events').EventEmitter.defaultMaxListeners = 20;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./config/db');
const session = require('express-session');
require('dotenv').config();
const cors = require('cors');
const cron = require('node-cron');
//const multer = require('multer');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRoutes');
const equipeRoutes = require('./routes/equipeRoutes');
const joueurRoutes = require('./routes/joueurRoutes');
const liveScoreRoutes = require('./routes/index');
const boxScoreRoutes = require('./routes/boxScoreRoutes');
const patineursRoutes = require('./routes/PatineursRoutesPages/patineursRoutes');

// import des routes des statistiques
const statistiqueGardienRoutes = require('./routes/statistiqueGardienRoutes');
const statistiqueEquipeRoutes = require('./routes/statistiqueEquipeRoutes');
const statistiqueJoueurRoutes = require('./routes/statistiqueJoueurRoutes');
const statistiqueRoutes = require('./routes/statistiquesRoutes');

// import route classement
const classementRoutes = require('./routes/classementRoutes'); 

const app = express();
connectDB();  

// config moteur de vue
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());  
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
//app.use(multer().single('photo'));

// config session utilisateur

app.use(session({
  secret: 'nhl',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // Cookie expire après 1 hre
}));


// ajout routes principales

app.use((req, res, next) => {
  //verifier si la session est active
  if (req.session && req.session.username) {
      // appliquer  image and username globalement  a toutes lesvues
      res.locals.userImage = req.session.userImage ? `/images/${req.session.userImage}` : '/images/puck.jpg';
      res.locals.username = req.session.username;
      res.locals.currentPage = req.url; 
  } else {
      res.locals.userImage = '/images/puck.jpg'; // Default image 
      res.locals.username = null; 
      res.locals.currentPage = req.url; 
  }
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', equipeRoutes);
app.use('/', joueurRoutes);
app.use('/', liveScoreRoutes);
app.use('/game', boxScoreRoutes);


// ajout routes statistiques
app.use('/stats/gardien', statistiqueGardienRoutes);
app.use('/stats/equipe', statistiqueEquipeRoutes);
app.use('/stats/joueur', statistiqueJoueurRoutes);
app.use('/stats', statistiqueRoutes);

// ajout route classement
app.use('/classement', classementRoutes);

// gestion erreurs 404
app.use(function(req, res, next) {
  next(createError(404));
});

// gestion erreurs serveur
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// demarrer serveur
app.listen(3000, () => {
  console.log('serveur demarre sur http://localhost:3000');
  console.log(`🕒 Heure système du serveur : ${new Date().toISOString()}`);

});

//Cron job planifier pour la mise a jour des données
const { getVideoIds } = require('./service/videoService'); 
const {mettreAJourToutesStatistiques} = require('./service/statistiqueApi');
const { insererUpdateJoueur } = require('./service/InformationApi');


cron.schedule('0 9 * * *', async () => {
  console.log(`[${new Date().toISOString()}] 🔄 Exécution de la tâche cron`);
  
  try {
      await getVideoIds();
      await insererUpdateJoueur();
      await mettreAJourToutesStatistiques();
      console.log(`[${new Date().toISOString()}] ✅ Données mises à jour`);
  } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Erreur dans getVideoIds() :`, error);
  }
});

/**
 * En hiver cron.schedule('0 9 * * *', async () => {
   En été cron.schedule('0 8 * * *', async () => {

 */




module.exports = app;
