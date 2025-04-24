// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');

const init = async () => {
    const notesService = new NotesService();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register({
        options: {
        },
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;


        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

init();