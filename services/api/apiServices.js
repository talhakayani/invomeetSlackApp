const axios = require('axios');

const DOMAIN = 'http://localhost:4000';
/**
 *  Rooms api Services
 */

exports.getAllRooms = async () => {
  try {
    const { data } = await axios.get(DOMAIN + '/rooms');
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getRoomInfoByName = async name => {
  try {
    const { data } = await axios.get(DOMAIN + `/rooms/find/${name}`);
    if (!data) return null;
    return data.rooms;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getAllRoomsWithAllMeetingsInProgress = async () => {
  try {
    const { data } = await axios.get(DOMAIN + '/rooms/meetings');
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getRoomIdByRoomName = async roomName => {
  try {
    const { data } = await axios.get(DOMAIN + `/rooms/ids/${roomName}`);
    if (!data.rooms.hasOwnProperty('id')) return null;
    return data.rooms.id;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getInProgressMeetingsByRooms = async roomName => {
  try {
    const { data } = await axios.get(DOMAIN + `/rooms/meetings/${roomName}`);
    if (!data) throw new Error('Something went wrong');
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getInProgressMeetingsByUser = async reservedBy => {
  try {
    const { data } = await axios.get(
      DOMAIN + `/rooms/meetings/inProgress/user/${reservedBy}`
    );
    if (!data) return [];
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getAllMeetingsByUser = async reservedBy => {
  try {
    const { data } = await axios.get(
      DOMAIN + `/rooms/meetings/user/${reservedBy}`
    );
    if (!data) return [];
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

/**
 * Google Calendar Configrations
 */
exports.addGoogleAuthToken = async (userId, token, calendarId) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: DOMAIN + '/calendar/token/add',
      data: { userId, token, calendarId },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!data) return null;
    return data;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};

exports.getGoogleAuthToken = async user_id => {
  try {
    const { data } = await axios.get(DOMAIN + `/calendar/find/${user_id}`);
    if (!data.hasOwnProperty('data')) return null;
    return JSON.parse(data.data.token);
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.addGoogleCalendar = async (user_id, { calendarId }) => {
  try {
    const { data } = await axios.put(DOMAIN + `/calendar/add/${user_id}`, {
      calendarId,
    });
    if (!data) return null;
    return data.message;
  } catch (err) {
    console.log(err);
    return null;
  }
};
exports.getGoogleCalendarId = async user_id => {
  try {
    const { data } = await axios.get(DOMAIN + `/calendar/find/${user_id}`);
    if (!data) return null;
    return data.data.calendarId;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 *  Meeting API
 */

exports.addInvoMeeting = async (
  reservedBy,
  reservedWith,
  reservedFrom,
  reservedTo,
  inProgress = 'InProgress',
  roomId,
  googleCalendarEventId
) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: DOMAIN + '/meetings/add',
      data: {
        reservedBy,
        reservedWith,
        reservedFrom,
        reservedTo,
        inProgress,
        roomId,
        googleCalendarEventId,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!data) throw new Error('No data found');
    return { data: true, meeting: data };
  } catch (err) {
    // console.log(err);
    return { data: false, message: err.response.data.message };
  }
};

exports.updateMeetingStatus = async meetingId => {
  try {
    console.log(meetingId);
    const { data } = await axios.put(DOMAIN + `/meetings/update/${meetingId}`);
    if (!data) return null;
    return data.message;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getMeetingHistory = async reservedBy => {
  try {
    const { data } = await axios.get(
      DOMAIN + `/meetings/history/${reservedBy}`
    );
    if (!data) return null;
    return data.meetings;
  } catch (err) {
    console.log(err);
    return err;
  }
};
// exports.getAvailableRooms = async () => {
//   try {
//     const { data } = await axios.get(DOMAIN_NAME + '/rooms/available'); // stuck process here
//     const { status, message, rooms } = data;
//     if (status != 200) return [];
//     return rooms;
//   } catch (err) {
//     console.log(room);
//   }
// };

// exports.getRoomInformationByName = async name => {
//   const { data } = await axios(DOMAIN_NAME + `/rooms/find/name/${name}`);
//   const { status, message, room } = data;
//   if (status !== 200) return [];
//   return room;
// };

// exports.reserveTheRoom = async (
//   name,
//   status,
//   reservedBy,
//   reservedWith,
//   reservedFrom
// ) => {
//   const { data } = await axios.put(
//     DOMAIN_NAME + `/rooms/update/status/${name}`,
//     {
//       status,
//       reservedBy,
//       reservedWith,
//       reservedFrom,
//     }
//   );
//   const { status: st, message } = data;
//   if (st == 200) return message;
//   else return message;
// };

// exports.getMeetings = async userId => {
//   const { data } = await axios.get(
//     DOMAIN_NAME + `/rooms/find/meetings/${userId}`
//   );
//   const { status, message, meetings } = data;
//   if (status != 200) return [];
//   return meetings;
// };

// exports.addTokenForGoogleCalendar = async body => {
//   const { data } = await axios({
//     method: 'post',
//     url: DOMAIN_NAME + '/calendar/token/add',
//     data: body,
//     headers: { 'Content-Type': 'application/json' },
//   });
//   console.log(data);
//   if (!data) return null;
//   return data;
// };

// exports.getTokenData = async userId => {
//   const { data } = await axios.get(DOMAIN_NAME + `/calendar/token/${userId}`);
//   if (!data) return null;
//   return data;
// };
// exports.isRoomAvailable = async room => {
//   const { data } = await axios.get(
//     DOMAIN_NAME + `/rooms/find/room/isAvailable/${room}`
//   );
//   if (!data) return null;
//   return data;
// };

// exports.getBusyRooms = async () => {
//   const { data } = await axios.get(DOMAIN_NAME + '/rooms/busy');
//   if (!data) return [];
//   return data.rooms;
// };
