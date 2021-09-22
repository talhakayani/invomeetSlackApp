const axios = require('axios');
const { response } = require('express');

const DOMAIN_NAME = 'http://localhost:4000';

exports.getAllRooms = async () => {
  const rooms = await axios(DOMAIN_NAME);
  if (rooms.status !== 200) return [];
  return rooms.rooms;
};

exports.getAvailableRooms = async () => {
  const { data } = await axios.get(DOMAIN_NAME + '/rooms/available'); // stuck process here
  const { status, message, rooms } = data;
  if (status != 200) return [];
  return rooms;
};

exports.getRoomInformationByName = async name => {
  const { data } = await axios(DOMAIN_NAME + `/rooms/find/name/${name}`);
  const { status, message, room } = data;
  if (status !== 200) return [];
  return room;
};

exports.reserveTheRoom = async (
  name,
  status,
  reservedBy,
  reservedWith,
  reservedFrom
) => {
  const { data } = await axios.put(
    DOMAIN_NAME + `/rooms/update/status/${name}`,
    {
      status,
      reservedBy,
      reservedWith,
      reservedFrom,
    }
  );
  const { status: st, message } = data;
  if (st == 200) return message;
  else return message;
};

exports.getMeetings = async userId => {
  const { data } = await axios.get(
    DOMAIN_NAME + `/rooms/find/meetings/${userId}`
  );
  const { status, message, meetings } = data;
  if (status != 200) return [];
  return meetings;
};

exports.addTokenForGoogleCalendar = async body => {
  const { data } = await axios({
    method: 'post',
    url: DOMAIN_NAME + '/calendar/token/add',
    data: body,
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(data);
  if (!data) return null;
  return data;
};

exports.getTokenData = async userId => {
  const { data } = await axios.get(DOMAIN_NAME + `/calendar/token/${userId}`);
  if (!data) return null;
  return data;
};
exports.isRoomAvailable = async room => {
  const { data } = await axios.get(
    DOMAIN_NAME + `/rooms/find/room/isAvailable/${room}`
  );
  if (!data) return null;
  return data;
};
