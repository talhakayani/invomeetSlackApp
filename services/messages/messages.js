exports.generateMessageForRooms = (rooms, available) => {
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
        initial_date: '1990-04-28',
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
        initial_time: '13:37',
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

  // rooms.forEach(room => {
  //   roomsRecord.push(
  //     {
  //       type: 'section',
  //       fields: [
  //         {
  //           type: 'mrkdwn',
  //           text: `*Room Name*:\n${room.name}`,
  //         },
  //         {
  //           type: 'mrkdwn',
  //           text: `*Room location*:\n${room.location}`,
  //         },
  //       ],
  //     },
  //     {
  //       type: 'section',
  //       fields: [
  //         {
  //           type: 'mrkdwn',
  //           text: `*Room Capacity*:\n${room.capacity}`,
  //         },
  //         {
  //           type: 'mrkdwn',
  //           text: `*Room Status*:\n*${room.status.toUpperCase()}*`,
  //         },
  //       ],
  //     },
  //     {
  //       type: 'section',
  //       text: {
  //         type: 'mrkdwn',
  //         text: 'Would you like to reserve the room?',
  //       },
  //       accessory: {
  //         type: 'button',
  //         text: {
  //           type: 'plain_text',
  //           text: 'Reserve',
  //           emoji: true,
  //         },
  //         style: 'primary',
  //         value: 'reserve_room',
  //         action_id: 'button-action' + room.id,
  //       },
  //     },
  //     {
  //       type: 'divider',
  //     }
  //   );
  // });
  return { blocks: roomsRecord };
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
