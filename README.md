# CS129.1 Contemporary Databases MapReduce Project

## Installation and Running

Be sure to have Node.js [installed](https://nodejs.org/en/download/package-manager/) on your machine.

Run `npm install`

Before running the node instance, start your mongo instance first.

To run the server: use the `npm start` command.

## Querying

The server currently has 2 endpoints available:
- `/object/{object-id}`: Used to get the details of pages/groups
- `/feed/{object-id}`: Used to get the feed of the pages/groups
- `/reactions/{post-id}`: Used to get the reactions for a post
- `/meta/{post-id}`: Get feed with associated reactions for each post in the feed


## Schema

### `meta` endpoint

~~~
{
  "post_id": <post_id>,
  "date_posted": <Date Object>,
  "post_message": <String of message/story>,
  "post_reactions": [
    {
      "id": <reaction_id>,
      "name": <Name of who reacted>,
      "type": <LIKE, LOVE, ...>
    },
    {
      "id": <reaction_id>,
      "name": <Name of who reacted>,
      "type": <LIKE, LOVE, ...>
    },
    {
      "id": <reaction_id>,
      "name": <Name of who reacted>,
      "type": <LIKE, LOVE, ...>
    },
  ],
  "post_comment_total": <Number of Comments>
}
~~~

To get the feed of a Facebook Group or Page, send a GET request to
the `/feed/{group or page-id}` endpoint

### Adding parameters to the feed query

You can use the following parameters to filter the query:

| Parameter | Function | Type |
|-----------|----------|------|
| since | Start date of query | UNIX Timestamp |
| until | End date of query | UNIX Timestamp |
| limit | Limit the returned posts of query | Number/Integer |

Use an ampersand (&) to use multiple parameters

Sample URL with parameters: `cs129-server.iandelacruz.me/meta/19440638720?since=1477958400&until=1479112780`

## Changelog
---

*29 Nov 2016*
- Changed the names of fields in the meta endpoint response
  - `data` -> `post_reactions`
- Added 3 new fields to the meta endpoint response
  - `date_posted`
  - `post_message`
  - `post_comment_total`
- Refactored code for modularization

`3 Dec 2016`
- Added a simple map-reduce function that counts the how many of each reactions there is to a specific post`
- You can now use the nickname, instead of the id, for querying
  - Example: You can use `CompSAteneo` for searching posts of CompSAt
  - This is the end of the URL of CompSAt
