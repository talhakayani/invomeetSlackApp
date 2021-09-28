const { google } = require('googleapis');

exports.addEvent = async (event, auth) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    });
    if (res.data === '') return null;
    return res.data;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};

exports.deleteGoogleCalendarEvent = async (eventId, calendarId, auth) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.delete({
      auth: auth,
      calendarId: calendarId,
      eventId: eventId,
    });
    if (res.data === '') return 'Event Deleted';
    return null;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};
