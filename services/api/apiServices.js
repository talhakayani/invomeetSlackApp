const axios = require('axios');

const DOMAIN_NAME = 'http://localhost:4000/rooms';

exports.getAllRooms = async () => {
  const rooms = await axios(DOMAIN_NAME);
  if (rooms.status !== 200) return [];
  return rooms.rooms;
};

exports.getAvailableRooms = async () => {
  const { data } = await axios(DOMAIN_NAME + '/available');
  const { status, message, rooms } = data;
  // console.log(status, message, rooms);
  if (status !== 200) return [];
  return rooms;
};

// Interactions
