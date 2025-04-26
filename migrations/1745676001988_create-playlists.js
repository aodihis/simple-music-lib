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
    pgm.createTable('playlists', {
        id: {
            type: 'varchar(21)',
            primaryKey: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        owner: {
            type: 'varchar(21)',
            references: '"users"',
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
    pgm.dropTable('playlists');
};
