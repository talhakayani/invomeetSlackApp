const axios = require('axios');
const { response } = require('express');

const DOMAIN_NAME = 'http://localhost:4000/rooms';

exports.getAllRooms = async () => {
  const rooms = await axios(DOMAIN_NAME);
  if (rooms.status !== 200) return [];
  return rooms.rooms;
};

exports.getAvailableRooms = async () => {
  const { data } = await axios.get(DOMAIN_NAME + '/available'); // stuck process here
  const { status, message, rooms } = data;
  if (status != 200) return [];
  return rooms;
};

exports.getRoomInformationByName = async name => {
  const { data } = await axios(DOMAIN_NAME + `/find/name/${name}`);
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
  const { data } = await axios.put(DOMAIN_NAME + `/update/status/${name}`, {
    status,
    reservedBy,
    reservedWith,
    reservedFrom,
  });
  const { status: st, message } = data;
  if (st == 200) return message;
  else return message;
};
