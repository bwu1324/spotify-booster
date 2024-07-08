import { Result, ResultType, backendHTTP } from '../../util';

export async function searchBackendForMashups(
  query: string,
  spotifyAccessToken: string | null
) {
  if (spotifyAccessToken === null) {
    return [];
  }

  if (query.length === 0) {
    try {
      return await backendHTTP
        .get('/mashupapi/getUserMashups')
        .then((response) => convertBackendMashups(response.data));
    } catch {
      console.error('Error retrieving user mashups.');
      return [];
    }
  }

  try {
    return await backendHTTP
      .get('/mashupapi/searchUserMashups', {
        params: { search_string: query, limit: 10 },
      })
      .then((response) => convertBackendMashups(response.data));
  } catch {
    console.error('Error retrieving user mashups.');
    return [];
  }
}

function convertBackendMashups(item: any): Array<Result> {
  let to_parse: any;
  if (item.results) {
    to_parse = item.results;
  } else if (item.mashups) {
    to_parse = item.mashups;
  } else {
    return [];
  }

  return to_parse.map((mashup: any) => ({
    id: mashup.mashup_id,
    name: mashup.name,
    resultType: ResultType.Mashup,
  }));
}
