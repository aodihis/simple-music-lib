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
    pgm.createExtension('uuid-ossp', { ifNotExists: true });
    pgm.createTable('albums', {
        id: {
            type: 'uuid',
            primaryKey: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        year: {
            type: 'integer',
            notNull: true,
        },
    });

    pgm.createTable('songs', {
        id: {
            type: 'uuid',
            primaryKey: true,
        },
        album_id: {
            type: 'integer',
            notNull: true,
            references: '"albums"',
            onDelete: 'cascade',
        },
        title: {
            type: 'varchar(255)',
            notNull: true,
        },
        year: {
            type: 'integer',
            notNull: true,
        },
        genre: {
            type: 'varchar(100)',
            notNull: true,
        },
        performer: {
            type: 'varchar(255)',
            notNull: true,
        },
        duration: {
            type: 'integer', // Assuming seconds
            notNull: false,
        },
    });
};



/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('songs');
    pgm.dropTable('albums');
};
