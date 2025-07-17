const express = require('express'); 
const router = express.Router();

const User = require('../models/userSchema');

const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
}); 

let upload = multer({ storage: storage }).single('image');

router.post('/addUser', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    });

    user.save()
        .then(result => {
            req.session.message = {
                type: 'success',
                message: 'User added successfully'
            };
            res.redirect('/');
        })
        .catch(err => {
            res.json({message:err.message});
        });
})

router.get('/addUser', (req, res) => {
    res.render('addUser', { title: 'Add User' });
});

router.get('/', async (req, res) => {
    const users = await User.find()
        .then(users => {
            res.render('index', { title: 'Home Page', users: users || [] });
        })
        .catch(err => {
            res.json({message: err.message});
        });
});

router.get('/about', (req, res) => {    
    res.render('about', { title: 'About Page' });
});

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Page' });
});

// Edit user route
router.get('/editUser/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId)
        .then(user => {
            if (user) {
                res.render('editUser', { title: 'Edit User', user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Update user route
router.post('/updateUser/:id', upload, (req, res) => {
    const userId = req.params.id;
    User.findByIdAndUpdate(userId, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file ? req.file.filename : undefined
    }, { new: true })
    .then(user => {
        if (user) {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully'
            };
            res.redirect('/');
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
});

router.get('/deleteUser/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId)
        .then(user => {
            if (user) {
                res.render('deleteUser', { title: 'Delete User', user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Delete user route
router.post('/deleteUser/:id', (req, res) => {
    const userId = req.params.id;
    User.findByIdAndDelete(userId)
        .then(result => {
            if (result) {
                req.session.message = {
                    type: 'success',
                    message: 'User deleted successfully'
                };
                res.redirect('/');
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

router.post('/contact', (req, res) => {
    console.log('req.body', req.body);
    res.send('Contact Page');
});

module.exports = router;
