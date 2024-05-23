const { Pool } = require('pg');

class Action {
    constructor() {
        this.pool = new Pool({
            user: 'your_username',
            host: 'localhost',
            database: 'your_database',
            password: 'your_password',
            port: 5432,
        });
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const result = await this.pool.query(
                "SELECT *, CONCAT(firstname, ' ', lastname) AS name FROM users WHERE email = $1 AND password = md5($2)",
                [email, password]
            );
            if (result.rows.length > 0) {
                const user = result.rows[0];
                req.session.login_id = user.id;
                req.session.login_email = user.email;
                req.session.login_firstname = user.firstname;
                req.session.login_lastname = user.lastname;
                req.session.login_name = user.name;
                // Add other session data as needed
                return res.status(200).json({ message: 'Login successful', user: user });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.redirect('/login'); // Redirect to login page after logout
            }
        });
    }

    // Implement other methods similarly
}

module.exports = Action;
