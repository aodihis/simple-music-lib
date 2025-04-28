const routes = (handler) => [
    {
        method: 'POST',
        path: '/export/playlists/{id}',
        handler: handler.postExportNotesHandler,
        options: {
            auth: 'jwt',
        },
    },
];

module.exports = routes;