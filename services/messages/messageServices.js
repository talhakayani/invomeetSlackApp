const { getUsersInformation } = require('../commands/commandServices');
const { getAllRooms, getRoomInfoByName } = require('../api/apiServices');
const {
  generatedTextForUsers,
  getDateAndTime,
} = require('../utils/helperFunctions');
exports.generateMessageForRooms = rooms => {
  let roomsRecord = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Meeting Room Reservation',
        emoji: true,
      },
    },
    {
      type: 'input',
      element: {
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Please select room ',
          emoji: true,
        },
        options: roomsSelectionOptions(rooms),
        action_id: 'room-selection',
      },
      label: {
        type: 'plain_text',
        text: 'Rooms Available',
        emoji: true,
      },
    },
    {
      type: 'input',
      element: {
        type: 'multi_users_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select meeting participants',
          emoji: true,
        },
        action_id: 'meeting-with',
      },
      label: {
        type: 'plain_text',
        text: 'Meeting with',
        emoji: true,
      },
    },
    {
      type: 'input',
      element: {
        type: 'datepicker',
        placeholder: {
          type: 'plain_text',
          text: 'Select a date',
          emoji: true,
        },
        action_id: 'meeting-date',
      },
      label: {
        type: 'plain_text',
        text: 'Meeting Date',
        emoji: true,
      },
    },
    {
      type: 'input',
      element: {
        type: 'timepicker',
        placeholder: {
          type: 'plain_text',
          text: 'Select time',
          emoji: true,
        },
        action_id: 'meeting-time',
      },
      label: {
        type: 'plain_text',
        text: 'Meeting time',
        emoji: true,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Reserve Room',
            emoji: true,
          },
          value: 'room_reserve_button_clicked',
          action_id: 'reserve-room-btn',
        },
      ],
    },
  ];
  return roomsRecord;
};

const roomsSelectionOptions = rooms => {
  let options = [];
  rooms.forEach(room => {
    options.push({
      text: {
        type: 'plain_text',
        text: `${room.name} Located: ${room.location}`,
        emoji: true,
      },
      value: `value-${room.id}`,
    });
  });

  return options;
};

// const dateTime = dateOrTime => {
//   const date = new Date();
//   return dateOrTime
//     ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
//     : `${date.getHours()}:${date.getMinutes()}`;
// };

exports.generateMessageForUpdate = async selectedInformation => {
  const { selected_room, selected_date, selected_time } = selectedInformation;
  // console.log(selected_date, selected_time, selected_room);
  let users = [],
    usersNames = [];
  const roomInfo = await getRoomInfoByName(selected_room);
  if (
    selectedInformation.hasOwnProperty('selected_users') &&
    selectedInformation.selected_users.length
  ) {
    users = selectedInformation.selected_users;
    // users = await getUsersInformation(selectedInformation.selected_users);
    // users.forEach(user => usersNames.push(user.user.real_name));
  }
  let blockJson = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Meeting Room Information',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${selected_room} Room* is reserved for you with ${generatedTextForUsers(
          users
        )} on *${selected_date}* at *${selected_time}*\nRoom is located at *${
          roomInfo.location
        }*`,
      },
    },
  ];
  return { blockJson, roomInfo };
};

exports.generateMessageForToken = tokenURL => {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          'Please click the link below and copy the token and paste that token in below textbox\n' +
          tokenURL,
      },
    },
    {
      dispatch_action: true,
      type: 'input',
      element: {
        type: 'plain_text_input',
        action_id: 'token-input',
      },
      label: {
        type: 'plain_text',
        text: 'Token',
        emoji: true,
      },
    },
  ];
};

// exports.generateMeetingsMessage = async meetings => {
//   const block = [
//     {
//       type: 'header',
//       text: {
//         type: 'plain_text',
//         text: 'Your Meetings',
//         emoji: true,
//       },
//     },
//   ];

//   for (let i = 0; i < meetings.length; i++) {
//     const { reservedWith, reservedFrom, location, name } = meetings[i];
//     const information = await getUsersInformation(reservedWith.split(','));
//     reservedFrom.replace('=', ' ');
//     const names = [];
//     information.forEach(info => {
//       names.push(info.user.real_name);
//     });
//     const userText = generatedTextForUsers(names);
//     const meetingList = {
//       type: 'section',
//       text: {
//         type: 'mrkdwn',
//         text: `${i + 1}. Meeting with ${userText} at *${reservedFrom.replace(
//           '=',
//           ' '
//         )}* in *${name}* Room on *${location}*`,
//       },
//     };
//     block.push(meetingList);
//   }
//   return block;
// };

exports.generateMesssageForMeetings = rooms => {
  //console.log(JSON.stringify(rooms, null, 2));
  let blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Meetings In Progress',
        emoji: true,
      },
    },
    {
      type: 'divider',
    },
  ];

  for (let i = 0; i < rooms.length; i++) {
    const room = {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${rooms[i].name} Room at ${rooms[i].location}`,
        emoji: true,
      },
    };
    blocks.push(room);

    for (let j = 0; j < rooms[i].meetings.length; j++) {
      const meetingWith = rooms[i].meetings[j].reservedWith.split(',');
      const textForMeetingWith = generatedTextForUsers(meetingWith);
      //console.log(textForMeetingWith);
      const meeting = {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${j + 1})\t<@${
            rooms[i].meetings[j].reservedBy
          }> reserve this room for Meeting with ${textForMeetingWith} started at *${new Date(
            rooms[i].meetings[j].reservedFrom
          )}* and will end on *${new Date(rooms[i].meetings[j].reservedTo)}*`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'End Meeting Now',
            emoji: true,
          },
          value: 'event is deleted',
          action_id: `private-endMeeting-${rooms[i].meetings[j].googleCalendarEventId}`,
        },
      };
      console.log(rooms[i].meetings[j].googleCalendarEventId);
      blocks.push(meeting);
    }
  }

  return blocks;
};

exports.generateMessageForMeetingHistory = meetings => {
  let blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Meetings History*',
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Clear History',
          emoji: true,
        },
        value: 'event is deleted',
        action_id: 'remove-history',
      },
    },
    {
      type: 'divider',
    },
  ];

  for (let i = 0; i < meetings.length; i++) {
    const room = {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${i + 1})\t${meetings[i].room.name} Room at ${
          meetings[i].room.location
        }`,
        emoji: true,
      },
    };
    blocks.push(room);
    const meetingWith = meetings[i].reservedWith.split(',');
    const textForMeetingWith = generatedTextForUsers(meetingWith);
    //console.log(textForMeetingWith);
    const meeting = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<@${
          meetings[i].reservedBy
        }> reserve this room for Meeting with ${textForMeetingWith} started at *${new Date(
          meetings[i].reservedFrom
        )}* and will end on *${new Date(meetings[i].reservedTo)}*`,
      },
    };
    blocks.push(meeting);
  }

  return blocks;
};

exports.generateMessageForReservedRooms = async rooms => {
  let blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Reserved Rooms',
        emoji: true,
      },
    },
  ];

  if (!rooms.length) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'There is no meeting room reserved',
      },
    });
    return blocks;
  }
  /*
  {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `1. *Red Room* is reserved by *<@EDEERC|Username>* with *Particepants* meeting will start at *starting time* and end on *ending time*`,
      },
    },
  */

  for (let i = 0; i < rooms.length; i++) {
    const data = await getUsersInformation(rooms[i].reservedWith.split(','));
    let users = [];
    data.forEach(info => users.push(info.user.real_name));
    const message = generatedTextForUsers(users);
    const dateTime = getDateAndTime(rooms[i].reservedFrom);
    const reservedRoom = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${i + 1}. *${rooms[i].name} Room* is reserved by *<@${
          rooms[i].reservedBy
        }>* with ${message} meeting will start at *${
          dateTime.start
        }* and end on *${dateTime.end}*`,
      },
    };
    blocks.push(reservedRoom);
  }
  return blocks;
};
