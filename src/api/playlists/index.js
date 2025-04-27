const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, {service, validator}) => {
        const usersHandler = new PlaylistHandler(service, validator);
        server.route(routes(usersHandler));
    },
};