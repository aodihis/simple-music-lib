const routes= (handler)  => [
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongHandler,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsHandler,
    },
    {
        method: 'POST',
        path: '/songs',
        handler: handler.createSongHandler,
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.updateSongHandler,
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongHandler,
    },
];

module.exports = routes;
