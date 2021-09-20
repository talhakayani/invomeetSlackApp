const fs = require('fs');
const path = require('path');
const app = require('../../connection/slackConnection');
const { getUsersInformation } = require('../commands/commandServices');
exports.findMentions = text => {
  const exp = /<(.*?)>/;
  var test = text.match(exp);
  var finalValue = [];
  while (test) {
    finalValue.push(test[0].split('|')[0].replace('<@', ''));
    text = text.replace(exp, '');
    test = text.match(exp);
  }
  if (!finalValue.lenght) return [];
  return finalValue;
};
// this function will save the information for single time
exports.insertInformation = (data, type) => {
  //path = '../../tempData.json';
  let readedJSON = {};
  if (!fs.existsSync('tempData.json')) {
    fs.writeFileSync('tempData.json', '');
  } else {
    readedJSON = JSON.parse(fs.readFileSync('tempData.json'));
  }
  switch (type) {
    case 'room-selection':
      readedJSON.selected_room = data;
      break;
    case 'meeting-with':
      readedJSON.selected_users = data;
      break;
    case 'meeting-date':
      readedJSON.selected_date = data;
      break;
    case 'meeting-time':
      readedJSON.selected_time = data;
      break;
  }

  fs.writeFileSync('tempData.json', JSON.stringify(readedJSON));
};

exports.getInformationFromTheFile = () => {
  // it will return an error when there no tempData.json file is exsits
  if (!fs.existsSync('tempData.json'))
    return {
      error: true,
      message: "You're not providing any meeting related information",
    };
  const data = JSON.parse(fs.readFileSync('tempData.json'));
  // it will return the JSON object when user select the room date and time
  if (
    data.hasOwnProperty('selected_room') &&
    data.hasOwnProperty('selected_date') &&
    data.hasOwnProperty('selected_time')
  ) {
    if (!data.selected_date && !data.selected_room && !data.selected_time)
      return {
        error: true,
        message:
          "please don't forget to select the Rooms Available, Meeting Date and Meeting time. Thank you",
      };
    return data;
  }

  // this will be return if user forget to select the date time and room for meeting
  return {
    error: true,
    message:
      "please don't forget to select the Rooms Available, Meeting Date and Meeting time. Thank you",
  };
};

exports.generatedTextForUsers = users => {
  if (!users.length) return '';
  if (users.length == 1) return `*${users[0]}*`;
  let text = 'with ';
  for (let i = 0; i < users.length - 1; i++) {
    text += '*' + users[i] + '*, ';
  }
  text += `and *${users[users.length - 1]}*`;
  return text;
};

exports.sendErrorMessage = message => {
  return [
    {
      type: 'section',
      text: { type: 'plain_text', text: message },
    },
  ];
};

/**
 * Implementation of google calendar event
 */

const TIMEOFFSET = '+05:00';

const dateTimeForCalander = (offset, dateTime) => {
  const [date, time] = dateTime.split('=');
  //const [year, month, day] = date.split('-');
  //const [hours, minutes] = time.split(':');

  const newDate = `${date}T${time}:00.000${offset}`;

  const event = new Date(Date.parse(newDate));

  const startDate = event;
  const endDate = new Date(
    new Date(startDate).setHours(startDate.getHours() + 1)
  );

  return {
    start: startDate,
    end: endDate,
  };
};

exports.eventForGoogleCalendar = information => {
  let dateTime = dateTimeForCalander(TIMEOFFSET, information.dateTime);
  let event = {
    summary: 'InvoMeet Room Reservation',
    location: information.location,
    description: information.message.replace('*', '').replace('/n', ' '),
    start: {
      dateTime: dateTime['start'],
      timeZone: 'Asia/Karachi',
    },
    end: {
      dateTime: dateTime['end'],
      timeZone: 'Asia/Karachi',
    },
    recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
    attendees: information.attendees,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };
  return event;
};
