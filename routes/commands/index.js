const controller = require('../../controller/commands/commandsController');
const router = require('express').Router();

router.post('/rooms-available', controller.roomsAvailable);
router.post('/connect-google-calendar', controller.connectToGoogleCalendar);
module.exports = router;
