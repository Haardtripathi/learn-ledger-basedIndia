// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/add-course', upload.single('video'), userControllers.createCourse);
router.get('/courses', userControllers.getCourses);

router.post('/courses/:id/buy-shares', userControllers.buyShares)

router.post('/courses/:id/purchase', userControllers.purchaseCourse)



module.exports = router;
