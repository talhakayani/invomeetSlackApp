const interactivity = require('../../controller/interactions/interactionController');
const router = require('express').Router();

router.use('/buttons', interactivity.interactions);

module.exports = router;
