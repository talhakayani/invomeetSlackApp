const router = require('express').Router();
const commands = require('./commands');
const interaction = require('./Interactivity');

router.use('/slash-command', commands);
router.use('/interactivity', interaction);
module.exports = router;
