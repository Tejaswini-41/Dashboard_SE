// Import the User model or interact with the database directly

// Add a new user
export const addUser = (req, res) => {
    const { email, username, password } = req.body;
    // Example: Create a new user in the database
    const newUser = {
        email,
        username,
        password
    };
    // Example: Save the new user to the database
    User.create(newUser)
        .then(user => {
            res.status(201).json({ success: true, user });
        })
        .catch(err => {
            console.error("Error adding user:", err);
            res.status(500).json({ success: false, message: "Failed to add user" });
        });
};

// Edit an existing user
export const editUser = (req, res) => {
    const userEmail = req.params.email;
    const { username, newPassword } = req.body;
    // Example: Find the user in the database by email and update its fields
    User.findOneAndUpdate({ email: userEmail }, { username, password: newPassword }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.json({ success: true, user });
        })
        .catch(err => {
            console.error("Error editing user:", err);
            res.status(500).json({ success: false, message: "Failed to edit user" });
        });
};

// Remove a user
export const removeUser = (req, res) => {
    const userEmail = req.params.email;
    // Example: Find the user in the database by email and remove it
    User.findOneAndRemove({ email: userEmail })
        .then(user => {
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.json({ success: true, message: "User removed successfully" });
        })
        .catch(err => {
            console.error("Error removing user:", err);
            res.status(500).json({ success: false, message: "Failed to remove user" });
        });
};
