const commandServices = require('../commands/commandServices');
const api = require('../api/apiServices');
const { generatedTextForUsers } = require('../utils/helperFunctions');
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
        text: `${room.name}`,
        emoji: true,
      },
      value: `value-${room.id}`,
    });
  });

  return options;
};

const dateTime = dateOrTime => {
  const date = new Date();
  return dateOrTime
    ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
    : `${date.getHours()}:${date.getMinutes()}`;
};

exports.generateMessageForUpdate = async selectedInformation => {
  const { selected_room, selected_date, selected_time } = selectedInformation;
  // console.log(selected_date, selected_time, selected_room);
  let users = [],
    usersNames = [];
  const roomInfo = await api.getRoomInformationByName(selected_room);
  if (
    selectedInformation.hasOwnProperty('selected_users') &&
    selectedInformation.selected_users.length
  ) {
    users = await commandServices.getUsersInformation(
      selectedInformation.selected_users
    );

    users.forEach(user => usersNames.push(user.user.real_name));
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
        text: `*${selected_room} Room* is reserved for you ${generatedTextForUsers(
          usersNames
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

/*
{
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Meeting Room Information",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Meeting Room name* is reserved for you with *Talha* and *Sheraz* on *Date* at *2:00PM*\nRoom is located at *Ground Floor*"
			}
		}
	]
}
*/

/*

{
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Meeting Room Reservation",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Please select room ",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "*this is plain_text text*",
							"emoji": true
						},
						"value": "value-0"
					}
				],
				"action_id": "room-selection"
			},
			"label": {
				"type": "plain_text",
				"text": "Rooms Available",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "multi_users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select meeting participants",
					"emoji": true
				},
				"action_id": "meeting-with"
			},
			"label": {
				"type": "plain_text",
				"text": "Meeting with",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "datepicker",
				"initial_date": "1990-04-28",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a date",
					"emoji": true
				},
				"action_id": "meeting-date"
			},
			"label": {
				"type": "plain_text",
				"text": "Meeting Date",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "timepicker",
				"initial_time": "13:37",
				"placeholder": {
					"type": "plain_text",
					"text": "Select time",
					"emoji": true
				},
				"action_id": "meeting-time"
			},
			"label": {
				"type": "plain_text",
				"text": "Meeting time",
				"emoji": true
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Reserve Room",
						"emoji": true
					},
					"value": "room_reserve_button_clicked",
					"action_id": "reserve-room-btn"
				}
			]
		}
	]
}

*/
