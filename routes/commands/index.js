const controller = require('../../controller/commands/commandsController');
const router = require('express').Router();

router.post('/rooms-available', controller.roomsAvailable);
router.post('/connect-google-calendar', controller.connectToGoogleCalendar);
router.post('/my-meetings', controller.my_meetings);
module.exports = router;
