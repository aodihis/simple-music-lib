const routes = (handler) => [
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumHandler,
    },
    {
        method: 'POST',
        path: '/albums',
        handler: handler.createAlbumHandler,
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.updateAlbumHandler,
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumHandler,
    },
];

module.exports = routes;
