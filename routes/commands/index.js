const controller = require('../../controller/commands/commandsController');
const router = require('express').Router();

router.post('/rooms-available', controller.roomsAvailable);

module.exports = router;
