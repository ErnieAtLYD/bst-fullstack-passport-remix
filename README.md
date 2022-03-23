# Passport Demo

## Installation

```bash
npm install
npm run dev
```

## Table Schemas

### user

| Column     |       Type       |   Modifiers    |
| ---------- | :--------------: | :------------: |
| id         | integer unsigned |    primary     |
| github_id  |     integer      |    not null    |
| avatar_url |      string      |    not null    |
| username   |      string      |    not null    |
| updated_at |    timestamp     | default to now |

### posts

| Column     |       Type       |   Modifiers    |
| ---------- | :--------------: | :------------: |
| id         | integer unsigned |    primary     |
| user_id    |   int unsigned   |  FK from user  |
| title      |      string      |    not null    |
| content    |       text       |    not null    |
| updated_at |    timestamp     | default to now |

## Server Endpoints

| Endpoint URL                    | Action | Description                                                                                |
| ------------------------------- | :----: | ------------------------------------------------------------------------------------------ |
| `/auth/github`                  |  GET   | WebApp calls this to start the GitHub login process                                        |
| `/auth/github/callback`         |  GET   | The "auth callback URL" value from your app page on github.com, ALSO inside `/server/.env` |
| `/auth/github/success-callback` |  GET   | A "sanity check" only used when we test GitHub server, in `/server/.env`                   |
| `/auth/github/profile`          |  GET   | Used by React app to get profile. GitHub auth required; checks req.user for login          |
| `/api/v1/posts/`                |  GET   | Gets all posts. Adds `isCurrentUser` if the user is logged in (via session)                |
| `/api/v1/posts/`                |  POST  | Create a new post, requires GitHub login                                                   |

## References

### Sessions

https://flaviocopes.com/express-sessions/
https://andyj.github.io/projects/node-session-management.html
https://cesare.substack.com/p/how-to-save-user-sessions-in-the?s=r - may be good if we want to implment connect-session-knex library
