# Mashup API Documentation
## Create Mashup
Creates a new mashup
```http
POST: /mashupapi/createMashup?name=mashup_name
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| name | `string` | Name of the mashup you're trying to create |

### Response
```js
{
  "mashup_id": string,
  "error_message": string
}
```
`"mashup_id"` is the unique mashup id of the mashup that was just created

`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (name was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Get Mashup Name
Fetches the name of a given mashup
```http
Get: /mashupapi/getMashupName?mashup_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| mashup_id | `string` | Unique mashup_id of the mashup you're trying to fetch |

### Response
```js
{
  "name": string
  "error_message": string
}
```
`"name"` is the name of the mashup

`"error_message"` contains an error message if there was an error

### Status Codes
| Code | Description |
| :--- | :--- |
| 200 | OK |
| 400 | BAD REQUEST (mashup_id was probably wrong) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Set Mashup Name
Updates the name of a given mashup
```http
PUT: /mashupapi/setMashupName?name=new_name&mashup_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| mashup_id | `string` | Unique mashup_id of the mashup you're trying to fetch |

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
| 400 | BAD REQUEST (probably mashup_id was wrong or name was invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Delete Mashup
Deletes the given mashup
```http
DELETE: /mashupapi/deleteMashup?mashup_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| mashup_id | `string` | Unique mashup_id of the mashup you're trying to delete |
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
| 400 | BAD REQUEST (mashup_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Get Mashup Tracks
```http
Get: /mashupapi/getMashupTracks?mashup_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| mashup_id | `string` | Unique mashup_id of the mashup you're trying to fetch |

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
| 400 | BAD REQUEST (mashup_id was probably wrong) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Add Track
Adds a new track in the given mashup
```http
PUT: /mashupapi/addTrack?track_id=6wmcrRId5aeo7hiEqHAtEO&mashup_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| track_id | `string` | Spotify track_id of song |
| mashup_id | `string` | Unique mashup_id of the mashup to add to |

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
| 400 | BAD REQUEST (mashup_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Set Track Start MS
Sets start time of track
```http
PUT: /mashupapi/setStartMs?track_id=6wmcrRId5aeo7hiEqHAtEO&mashup_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg&start_ms=123
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| track_id | `string` | Spotify track_id of song |
| mashup_id | `string` | Unique mashup_id of the mashup to add to |
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
| 400 | BAD REQUEST (mashup_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |


## Set Track End MS
Sets end time of track
```http
PUT: /mashupapi/setEndMs?track_id=6wmcrRId5aeo7hiEqHAtEO&mashup_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg&end_ms=123
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| track_id | `string` | Spotify track_id of song |
| mashup_id | `string` | Unique mashup_id of the mashup to add to |
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
| 400 | BAD REQUEST (mashup_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

## Remove Track
Removes a given track in the given mashup
```http
DELETE: /mashupapi/removeTrack?track_id=6wmcrRId5aeo7hiEqHAtEO&mashup_id=MTUxODVkMzFmZDc2MGUwNjg2YjFiMTFjZTRkNzYxMjAzNjJmYjc5NTU4ZTg4MGVhODBiOGE4NDAwYmNlM2FjZg
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| track_id | `string` | Spotify track_id of song |
| mashup_id | `string` | Unique mashup_id of the mashup to remove track from |

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
| 400 | BAD REQUEST (mashup_id was probably invalid) |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |