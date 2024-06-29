// sectionsRoute.js

const express = require('express');
const router = express.Router();
const sectionsController = require('../../controllers/sections/sectionsController');
const jwt = require('../../middlewares/jwtMiddleware')
const checkAdmin = require('../../middlewares/checkAdminMiddleware')

router.use(jwt)
router.use(checkAdmin)
router.post('/', sectionsController.createSection);
router.get('/', sectionsController.getAllSections);
router.get('/sections/:section_id', sectionsController.getSectionById);
router.put('/sections/:section_id', sectionsController.updateSection);
router.delete('/sections/:section_id', sectionsController.deleteSection);

module.exports = router;
