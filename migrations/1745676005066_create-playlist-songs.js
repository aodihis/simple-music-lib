/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'varchar(21)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'varchar(21)',
            references: '"playlists"',
            notNull: true,
            onDelete: 'cascade',
        },
        song_id: {
            type: 'varchar(21)',
            references: '"songs"',
            notNull: true,
            onDelete: 'cascade',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist_songs');
};
