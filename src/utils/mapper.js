function mapAlbumDBToModel(row) {
    return {
        id: row.id,
        name: row.name,
        year: row.year,
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

module.exports = {
    mapAlbumDBToModel,
    mapSongDBToModel,
    mapSongsDBToModel
};
