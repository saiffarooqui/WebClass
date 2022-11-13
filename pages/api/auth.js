import Pusher from 'pusher';

const pusher = new Pusher({
  key: process.env.key,
  appId: process.env.appId,
  secret: process.env.secret,
  cluster: process.env.cluster,
});
/*app_id = "1498566"
key = "c753a8be046a908376fc"
secret = "baf8660e935c53822094"
cluster = "ap2" */
export default function Send(req, res) {
  const { socket_id, channel_name } = req.body;
  res.send(pusher.authenticate(socket_id, channel_name));
}
