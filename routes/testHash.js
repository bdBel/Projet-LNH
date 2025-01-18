const bcrypt = require('bcryptjs');

(async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('1111', salt); // Use test password
        console.log("Generated Hash:", hashedPassword); // Debugging output
    } catch (err) {
        console.error("Error in hashing test:", err);
    }
})();
