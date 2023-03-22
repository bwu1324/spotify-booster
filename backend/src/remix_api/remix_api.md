# Remix API Documentation
## Create Remix
Creates a new remix
```http
POST: /remixapi/createRemix?name=remix_name
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| name | `string` | Name of the remix you're trying to create |

### Response
```js
{
  "remix_id": string,
  "error_message": string
}
```
`"remix_id"` is the unique remix id of the remix that was just created

`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (name was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Get Remix Name
Fetches the name of a given remix
```http
Get: /remixapi/getRemixName?remix_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| remix_id | `string` | Unique remix_id of the remix you're trying to fetch |

### Response
```js
{
  "name": string
  "error_message": string
}
```
`"name"` is the name of the remix

`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (remix_id was probably wrong) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Set Remix Name
Updates the name of a given remix
```http
PUT: /remixapi/setRemixName?name=new_name&remix_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| remix_id | `string` | Unique remix_id of the remix you're trying to fetch |

### Response
```js
{
  "error_message": string
}
```
`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (probably remix_id was wrong or name was invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Delete Remix
Deletes the given remix
```http
DELETE: /remixapi/deleteRemix?remix_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| remix_id | `string` | Unique remix_id of the remix you're trying to delete |
### Response
```js
{
  "error_message": string
}
```
`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (remix_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Get Remix Tracks
```http
Get: /remixapi/getRemixTracks?remix_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| remix_id | `string` | Unique remix_id of the remix you're trying to fetch |

### Response
```js
type TrackInfo = {
  track_id: string,
  start_ms: number,
  end_ms: number,
};

{
  "tracks": Array<TrackInfo>,
  "error_message": string
}
```
`"tracks"` is an array of TrackInfo objects 

`"TrackInfo.track_id"` is the Spotify track id of song

`"TrackInfo.start_ms"` is the start time of song in milliseconds

`"TrackInfo.end_ms"` is the end time of song in milliseconds

`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (remix_id was probably wrong) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Add Track
Adds a new track in the given remix
```http
PUT: /remixapi/addTrack?track_id=6wmcrRId5aeo7hiEqHAtEO&remix_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| track_id | `string` | Spotify track_id of song |
| remix_id | `string` | Unique remix_id of the remix to add to |

### Response
```js
{
  "error_message": string
}
```
`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (remix_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Set Track Start MS
Sets start time of track
```http
PUT: /remixapi/setStartMs?track_id=6wmcrRId5aeo7hiEqHAtEO&remix_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg&start_ms=123
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| track_id | `string` | Spotify track_id of song |
| remix_id | `string` | Unique remix_id of the remix to add to |
| start_ms | `integer` | Time in milliseconds of start of track (must be >= 0) |

### Response
```js
{
  "error_message": string
}
```
`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (remix_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |


## Set Track End MS
Sets end time of track
```http
PUT: /remixapi/setEndMs?track_id=6wmcrRId5aeo7hiEqHAtEO&remix_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg&end_ms=123
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| track_id | `string` | Spotify track_id of song |
| remix_id | `string` | Unique remix_id of the remix to add to |
| start_ms | `integer` | Time in milliseconds of end of track (must be >= -1 where -1 indicates end of track)|

### Response
```js
{
  "error_message": string
}
```
`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (remix_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Remove Track
Removes a given track in the given remix
```http
DELETE: /remixapi/removeTrack?track_id=6wmcrRId5aeo7hiEqHAtEO&remix_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| track_id | `string` | Spotify track_id of song |
| remix_id | `string` | Unique remix_id of the remix to remove track from |

### Response
```js
{
  "error_message": string
}
```
`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (remix_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |