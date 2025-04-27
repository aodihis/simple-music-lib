const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.createPlaylist,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylists,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylist,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.addSong,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getSongs,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deleteSong,
        options: {
            auth: 'jwt',
        },
    },
];

module.exports = routes;