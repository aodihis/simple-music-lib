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
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.uploadCoverAlbumHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000
            },
        },
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.likeAlbumHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handler.dislikeAlbumHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getLikesHandler,
        options: {
            auth: 'jwt',
        },
    },
];

module.exports = routes;
