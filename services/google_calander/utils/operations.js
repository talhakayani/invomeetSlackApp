const { google } = require('googleapis');

exports.addEvent = auth => {
  const calendar = google.calendar({ version: 'v3', auth });
  calendar.events.insert(
    {
      auth: auth,
      calendarId: 'primary',
      resource: event,
    },
    function (err, event) {
      if (err) {
        console.log(
          'There was an error contacting the Calendar service: ' + err
        );
        return;
      }
      console.log('Event created:');
    }
  );
};
