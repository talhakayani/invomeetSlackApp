const controller = require('../../controller/commands/commandsController');
const router = require('express').Router();

router.post('/rooms-available', controller.roomsAvailable);
router.post('/connect-google-calendar', controller.connectToGoogleCalendar);
router.post('/my-meetings', controller.my_meetings);
router.post('/reserved-rooms', controller.getInfoReservedRooms);
router.post('/meetings-history', controller.getEndMeetingsHistory);
module.exports = router;
