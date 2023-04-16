import axios from 'axios';
import backend_config from '../../../config/backend_config';
import { Result, ResultType } from '../../util';

export async function searchBackendForMashups(
  query: string,
  spotifyAccessToken: string | null
) {
  if (spotifyAccessToken === null) {
    return [];
  }

  if (query.length === 0) {
    return await axios
      .get('/mashupapi/getUserMashups', { baseURL: backend_config.baseURL })
      .then((response) => convertBackendMashups(response.data));
  }

  try {
    return await axios
      .get('/mashupapi/searchUserMashups', {
        baseURL: backend_config.baseURL,
        params: { search_string: query, limit: 10 },
      })
      .then((response) => convertBackendMashups(response.data));
  } catch (error) {
    console.error('Error retrieving user mashups.');
    return [];
  }
}

function convertBackendMashups(item: any): Array<Result> {
  if (item.results) {
    return item.results.map((mashup: any) => ({
      id: mashup.mashup_id,
      name: mashup.name,
      type: ResultType.Mashup,
    }));
  }
  return [];
}
