import crypto from 'crypto';

import SQLiteInterface from '../sqlite_interface/sqlite_interface';

/**
 * MashupDBInterface() - Partial definition of DatabaseInterface
 * Handles creating/editing/deleting mashups
 */
export default class MashupDBInterface extends SQLiteInterface {
  /**
   * generateMashupId_() - generates a unique mashup id each time it is called
   * @returns - a unique mashup id
   */
  private generateMashupId_(): string {
    return crypto.randomUUID();
  }

  /**
   * isEmpty() - checks if a string is empty or only contains whitespace
   * @param str - string to check
   * @returns - if string is empty or not
   */
  protected isEmpty(str: string): boolean {
    return str === null || str === undefined || str.match(/^\s*$/) !== null || str === '';
  }

  /**
   * assertMashupExists() - Checks if a mashup exists in the database, throw error if not
   * @param mashup_id - unique mashup id
   * @returns - Promise that resolves if mashup exists, throws error if not
   */
  protected async assertMashupExists(mashup_id: string): Promise<void> {
    try {
      await this.getMashupName(mashup_id);
    } catch {
      this.log_.warn(`${mashup_id} was not a valid mashup_id`);
      throw new Error('Invalid Mashup Id');
    }
  }

  /**
   * mashupPermission() - checks if a user has permission to access/edit a mashup
   * @param mashup_id - unique mashup id
   * @param user_id - user id of user to check if they have permission to access mashup
   * @returns - Promise that resolves to true if user has permission, false if not
   */
  async mashupPermission(mashup_id: string, user_id: string): Promise<boolean> {
    const results = (await this.dbAll('SELECT COUNT(*) FROM mashups WHERE mashup_id = $mashup_id AND user_id = $user_id', {
      $mashup_id: mashup_id,
      $user_id: user_id,
    })) as Array<{ 'COUNT(*)': number }>;

    return results[0]['COUNT(*)'] === 1;
  }

  /**
   * createMashup() - creates a new empty mashup
   * @param name - name of mashup
   * @param user_id - user id of user creating mashup
   * @returns Promise resolving to unique mashup id (rejected if an error occurs)
   */
  async createMashup(name: string, user_id: string): Promise<string> {
    const mashup_id = this.generateMashupId_();
    this.log_.debug(`Creating new mashup with name ${name} and mashup_id ${mashup_id}`);

    // check for invalid name
    if (this.isEmpty(name)) {
      this.log_.debug(`name ${name} was empty, refusing to create new mashup`);
      throw new Error('Invalid Mashup Name');
    }

    await this.dbRun('INSERT INTO mashups VALUES ($mashup_id, $name, $user_id);', {
      $mashup_id: mashup_id,
      $name: name.trim(), // make sure to trim name
      $user_id: user_id,
    });

    return mashup_id;
  }

  /**
   * getUserMashups() - Gets all of a users mashups
   * @param user_id - spotify user id to get mashups for
   * @returns - Array containing mashup_id and name of string
   */
  async getUserMashups(user_id: string): Promise<Array<{ mashup_id: string; name: string }>> {
    const rows = (await this.dbAll('SELECT mashup_id, name FROM mashups WHERE user_id = $user_id', {
      $user_id: user_id,
    })) as Array<{ mashup_id: string; name: string }>;

    return rows;
  }

  /**
   * searchUserMashups() - Searchs a users mashups
   * Uses basic SQLite LIKE, matches mashups whose name begins with search_string
   * @param user_id - spotify user id to get mashups for
   * @param search_string - string to search for
   * @returns - Array containing mashup_id and name of string
   */
  async searchUserMashups(
    user_id: string,
    search_string: string,
    limit?: number
  ): Promise<Array<{ mashup_id: string; name: string }>> {
    if (!limit) limit = 20;

    const rows = (await this.dbAll(
      'SELECT mashup_id, name FROM mashups WHERE user_id = $user_id AND name LIKE $search LIMIT $limit',
      {
        $user_id: user_id,
        $search: `${search_string}%`,
        $limit: limit,
      }
    )) as Array<{ mashup_id: string; name: string }>;

    return rows;
  }

  /**
   * getMashupName() - gets the name of a mashup
   * @param mashup_id - unique mashup id
   * @returns Promise resolving to mashup name (rejected if an error occurs)
   */
  async getMashupName(mashup_id: string): Promise<string> {
    // fetch from database
    const rows = (await this.dbAll('SELECT name FROM mashups WHERE mashup_id = $mashup_id;', {
      $mashup_id: mashup_id,
    })) as Array<{ name: string; mashup_id: string }>;

    // reject if no mashups found
    if (rows.length === 0) {
      this.log_.warn(`Mashup with mashup_id ${mashup_id} not found, assuming invalid mashup_id`);
      throw new Error('Invalid Mashup Id');
    }

    return rows[0].name;
  }

  /**
   * setMashupName() - updates the name of a mashup
   * @param mashup_id - unique mashup id
   * @param new_name - new mashup name
   * @returns Promise resolving to nothing if mashup id is valid (rejected if an error occurs)
   */
  async setMashupName(mashup_id: string, new_name: string): Promise<void> {
    this.log_.debug(`Updating mashup with mashup_id ${mashup_id} with name ${new_name}`);

    await this.assertMashupExists(mashup_id);

    // check for invalid name
    if (this.isEmpty(new_name)) {
      this.log_.debug(`name ${new_name} was empty, refusing to update mashup`);
      throw new Error('Invalid Mashup Name');
    }

    await this.dbRun('UPDATE mashups SET name = $name WHERE mashup_id = $mashup_id;', {
      $mashup_id: mashup_id,
      $name: new_name.trim(), // make sure to trim name
    });
  }

  /**
   * deleteMashup() - deletes a mashup
   * @param mashup_id - unique mashup id
   * @param user_id - user id
   * @returns Promise resolving to nothing if mashup id is valid (rejected if an error occurs)
   */
  async deleteMashup(mashup_id: string): Promise<void> {
    this.log_.debug(`Deleting mashup with mashup_id ${mashup_id}`);

    await this.assertMashupExists(mashup_id);

    await this.dbRun('DELETE FROM mashups WHERE mashup_id = $mashup_id;', {
      $mashup_id: mashup_id,
    });
  }

  /**
   * mashupCount() - gets number of mashups in database
   * @returns Promise resolving to number of mashups in database (rejected if an error occurs)
   */
  async mashupCount(): Promise<number> {
    const rows = (await this.dbAll('SELECT COUNT(1) FROM mashups;', {})) as Array<{ 'COUNT(1)': number }>;
    return rows[0]['COUNT(1)'];
  }
}
