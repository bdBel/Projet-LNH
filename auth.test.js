const { loginUser } = require('./service/userService');

const User = require('./models/User');
const bcrypt = require('bcryptjs');
// simuler le modèle User et bcrypt
jest.mock('./models/User'); 
jest.mock('bcryptjs'); 

//test de la fonction loginUser pour un appel réussi
describe('loginUser', () => {
    it('doit retourner l\'utilisateur', async () => {
        try {
            await loginUser('', '');
        } catch (error) {
            expect(error.message).toBe('Email et mot de passe requis');
        }
    });

    it('Doit lancer une erreur si des identifiants invalides sont fourni', async () => {
        try {
            await loginUser('userNonExistant@example.com', 'wrongpassword');
        } catch (error) {
            expect(error.message).toBe('identifiants invalides');
        }
    });

    it('devrait lancer une erreur si des identifiants invalides sont fourni', async () => {
        // Simuler le User.findOne pour renvoyer null (simulant un utilisateur non trouvé)
        User.findOne.mockResolvedValue(null);

        try {
            await loginUser('nonexistentuser@example.com', 'password');
        } catch (error) {
            expect(error.message).toBe('Invalid credentials');
        }
    });

    it('should throw an error if passwords do not match', async () => {
        // Mock the User.findOne to return a user object
        const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
        User.findOne.mockResolvedValue(mockUser);

        // Simule bycrypt.compare pour retourner faux (mots de passe ne correspondent pas)
        bcrypt.compare.mockResolvedValue(false);

        try {
            await loginUser('test@example.com', 'wrongpassword');
        } catch (error) {
            expect(error.message).toBe('Invalid credentials');
        }
    });

    it('should return the user if credentials are valid', async () => {
        // simule  User.findOne pour renvoyer un objet utilisateur
        const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
        User.findOne.mockResolvedValue(mockUser);

        // simule bycrypt.compare pour retourner vrai si les mots de passe correspondent
        bcrypt.compare.mockResolvedValue(true);

        const user = await loginUser('test@example.com', 'password');
        expect(user).toEqual(mockUser); 
    });
});
