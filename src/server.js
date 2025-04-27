require('dotenv').config();

const Hapi = require('@hapi/hapi');

const albums = require('./api/albums');
const songs = require('./api/songs');
const authentications = require('./api/authentications');
const users = require('./api/users');


const ClientError = require("./exceptions/ClientError");
const AlbumService = require("./services/AlbumService");
const SongService = require("./services/SongService");
const UserService = require("./services/UserService");
const AuthenticationService = require("./services/AuthenticationService");
const PlaylistService = require("./services/PlaylistService");

const TokenManager = require("./tokenize/TokenManager");

const AlbumValidator = require("./validators/album");
const SongValidator = require("./validators/song");
const AuthenticationValidator = require("./validators/authentication");
const UserValidator = require("./validators/user");
const PlaylistValidator = require("./validators/playlist");
const PlaylistSongValidator = require("./validators/playlist_song");

const init = async () => {
    const albumService = new AlbumService();
    const songService = new SongService();
    const userService = new UserService();
    const authenticationService = new AuthenticationService();
    const playlistService = new PlaylistService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumService,
                validator: AlbumValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songService,
                validator: SongValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: userService,
                validator: UserValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService: authenticationService,
                usersService: userService,
                tokenManager: TokenManager,
                validator: SongValidator,
            },
        }
    ]);

    server.ext('onPreResponse', (request, h) => {
        const {response} = request;
        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }
            if (!response.isServer) {
                return h.continue;
            }

            console.error(response.stack);
            const newResponse = h.response({
                status: 'error',
                message: 'Something went wrong!',
            });
            newResponse.code(500);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

init();