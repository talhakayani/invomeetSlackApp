exports.interactions = (req, res, _next) => {
  try {
    res.status(200).send();
    const payload = JSON.parse(req.body.payload);
    const actions = payload.actions;
    if (!actions.length)
      return res.status(400).send('Please interact with elements');

    const [data] = actions;
    console.log(data);

    const { type, action_id } = data;

    switch (action_id) {
      case 'room-selection':
        const { selected_option } = data;
        break;
      case 'meeting-with':
        const { selected_users } = data;
        break;
      case 'meeting-date':
        const { selected_date } = data;
        break;
      case 'meeting-time':
        const { selected_time } = data;
        break;
      case 'reserve-room-btn':
        //TODO implementaion here for all room reserve
        break;
    }
    //console.log(data);
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send('something went wrong');
  }
};
