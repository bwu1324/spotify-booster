import { Database, verbose } from 'sqlite3';
const sqlite3 = verbose();
import crypto from 'crypto';

import Logger from './logger';

export default class DatabaseInterface {
  // unlikely that 10 new remixes will be created every millisecond, so this should guarantee a unique remix_id
  private remix_id_gen_ = Date.now() * 10;
  private log_: Logger;
  private db_: Database;
  private ready_: Promise<void>;

  /**
   * @param database_path - path to the .db file
   */
  constructor(database_path: string) {
    this.log_ = new Logger('Database');
    this.initializeDatabase_(database_path);

    this.ready_.catch((error) => {
      throw error;
    });
  }

  /**
   * createRemix() - creates a new empty remix
   * @param name - name of remix
   * @returns Promise resolving to unique remix id (rejected if an error occurs)
   */
  async createRemix(name: string): Promise<string> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      const profile = this.log_.profile('Create Remix');

      if (this.isEmpty(name)) {
        this.log_.debug(`name ${name} was empty, refusing to create new remix`);
        profile.stop({
          level_thresholds: { debug: 0, warn: 1000, error: 5000 },
        });
        reject(new Error('Invalid Remix Name'));
        return;
      }

      const remix_id = this.generateRemixId_();
      this.log_.debug(
        `Creating new remix with name ${name} and remix_id ${remix_id}`
      );

      // run commands in series
      this.db_.serialize(() => {
        this.db_.run(
          'INSERT INTO remixes VALUES ($remix_id, $name);',
          {
            $remix_id: remix_id,
            $name: name.trim(), // make sure to trim name
          },
          (error) => {
            profile.stop({
              level_thresholds: { debug: 0, warn: 1000, error: 5000 },
            });

            if (error) {
              this.log_.error(
                `Error while creating remix with name ${name}`,
                error
              );
              reject(error);
              return;
            }

            this.log_.info(
              `Created new remix with name ${name} and remix_id ${remix_id}`
            );
            resolve(remix_id);
          }
        );
      });
    });
  }

  /**
   * getRemixName() - gets the name of a remix
   * @param remix_id - unique remix id
   * @returns Promise resolving to remix name (rejected if an error occurs)
   */
  async getRemixName(remix_id: string): Promise<string> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      // run commands in series
      this.db_.serialize(() => {
        this.db_.get(
          'SELECT name FROM remixes WHERE remix_id = $remix_id;',
          {
            $remix_id: remix_id,
          },
          (error, row) => {
            if (error) {
              this.log_.error(
                `Error while fetching remix with remix_id ${remix_id}`,
                error
              );
              reject(error);
              return;
            }
            resolve(row['name']);
          }
        );
      });
    });
  }

  /**
   * setRemixName() - updates the name of a remix
   * @param remix_id - unique remix id
   * @param new_name - new remix name
   * @returns Promise resolving to nothing if remix id is valid (rejected if an error occurs)
   */
  async setRemixName(remix_id: string, new_name: string): Promise<void> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  /**
   * deleteRemix() - deletes a remix
   * @param remix_id - unique remix id
   * @returns Promise resolving to nothing if remix id is valid (rejected if an error occurs)
   */
  async deleteRemix(remix_id: string): Promise<void> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  /**
   * getRemixTracks() - gets all tracks of a remix
   * @param remix_id - unique remix id
   * @returns Promise resolving to array of spotify track ids (rejected if an error occures)
   */
  async getRemixTracks(remix_id: string): Promise<Array<string>> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }

  /**
   * addTrack() - adds a track from remix ensuring no repeats in a remix
   * Note: Aside from blank track_id, the validity of track_id is not checked! (check with spotify first!)
   * @param remix_id - unique remix id
   * @param track_id - spotify track id of track to add to remix
   * @returns Promise resolving to nothing if remix id and track id are valid (rejected if an error occurs)
   */
  async addTrack(remix_id: string, track_id: string): Promise<void> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  /**
   * removeTrack() - removes a track from remix
   * @param remix_id - unique remix id
   * @param track_id - spotify track id of track to remove from remix
   * @returns Promise resolving to nothing if remix id and track id are valid (rejected if an error occurs)
   */
  async removeTrack(remix_id: string, track_id: string): Promise<void> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  /**
   * remixCount() - gets number of remixes in database
   * @returns Promise resolving to number of remixes in database (rejected if an error occurs)
   */
  async remixCount(): Promise<number> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      // run commands in series
      this.db_.serialize(() => {
        this.db_.get('SELECT COUNT(1) FROM remixes;', (error, row) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(row['COUNT(1)']);
        });
      });
    });
  }

  /**
   * totalTrackCount() - gets number of tracks in database
   * @returns Promise resolving to number of tracks in database (rejected if an error occurs)
   */
  async totalTrackCount(): Promise<number> {
    await this.ready_;
    return new Promise((resolve, reject) => {
      // run commands in series
      this.db_.serialize(() => {
        this.db_.get('SELECT COUNT(1) FROM tracks;', (error, row) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(row['COUNT(1)']);
        });
      });
    });
  }

  /**
   * initialize_database_() - accesses database and creates tables that we need
   * @param database_path - path to the .db file
   */
  private initializeDatabase_(database_path: string): void {
    this.ready_ = new Promise((resolve, reject) => {
      const profile = this.log_.profile('Initialize Database');

      // load database from file, fatal error if this fails
      this.db_ = new sqlite3.Database(database_path, (error) => {
        if (error) {
          this.log_.fatal(
            `Failed to open database at: ${database_path}`,
            error
          );
          profile.stop();
          reject(error);
        }
      });

      // create the tables needed
      const tables = [
        {
          name: 'tracks',
          cols: '(remix_id STRING NOT NULL, track_id STRING NOT NULL)',
        },
        {
          name: 'remixes',
          cols: '(remix_id STRING NOT NULL, name STRING NOT NULL)',
        },
      ];

      let count = 0;
      for (let i = 0; i < tables.length; i++) {
        this.db_.run(
          `CREATE TABLE ${tables[i].name} ${tables[i].cols}`,
          (error) => {
            if (error) {
              // ignore if error is that table already exists
              if (
                error.message.includes(`table ${tables[i].name} already exists`)
              ) {
                return;
              }

              this.log_.fatal(`Creating table: ${tables[i].name}.`, error);
            }

            // count how many commands have been completed, done initializing once all have been run
            count++;
            if (count === tables.length) {
              profile.stop({
                level_thresholds: { info: 0, warn: 1000, error: 5000 },
              });
              resolve();
            }
          }
        );
      }
    });
  }

  /**
   * generateRemixId_() - generates a unique remix id each time it is called
   * @returns - a unique remix id
   */
  private generateRemixId_(): string {
    this.remix_id_gen_++;
    return crypto
      .createHash('sha256')
      .update(this.remix_id_gen_.toString())
      .digest('base64');
  }

  /**
   * isEmpty() - checks if a string is empty or only contains whitespace
   * @param str - string to check
   * @returns - if string is empty or not
   */
  private isEmpty(str: string): boolean {
    return str === null || str.match(/^\s*$/) !== null || str === '';
  }
}
