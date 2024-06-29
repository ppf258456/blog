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
// 获取被软删除的分区
router.get('/deleted', sectionsController.getDeletedSections);

// 恢复被软删除的分区
router.post('/restore/:id', sectionsController.restoreSection);

module.exports = router;
