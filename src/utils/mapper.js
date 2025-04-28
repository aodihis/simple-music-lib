function mapAlbumDBToModel(row) {
    return {
        id: row.id,
        name: row.name,
        year: row.year,
        coverUrl: row.cover,
    };
}

function mapSongsDBToModel(row) {
    return {
        id: row.id,
        title: row.title,
        performer: row.performer,
    };
}

function mapSongDBToModel(row) {
    return {
        id: row.id,
        title: row.title,
        year: row.year,
        genre: row.genre,
        performer: row.performer,
        duration: row.duration,
        albumId: row.album_id,
    };
}

function mapPlaylistDBToModel(row) {
    return {
        id: row.id,
        name: row.name,
        username: row.username,
    }
}

function mapPlaylistSongDBToModel(row) {
    return {
        id: row.id,
        title: row.title,
        performer: row.performer,
    }
}


module.exports = {
    mapAlbumDBToModel,
    mapSongDBToModel,
    mapSongsDBToModel,
    mapPlaylistDBToModel,
    mapPlaylistSongDBToModel,
};

