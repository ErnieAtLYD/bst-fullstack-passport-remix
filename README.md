# Passport Demo

## Installation

Because this app uses GitHub logins, set up your app in GitHub:

1. Go to Account Settings
2. Select Developer settings from the sidebar
3. Then click on OAuth Apps and then on Register new application
4. Enter Application Name and Homepage URL
5. For Authorization Callback URL: `http://localhost:[PORT]/auth/github/callback`
6. Click Register application
7. Copy and paste Client ID and Client Secret keys into .env file

[(instruction credits)](https://github.com/sahat/hackathon-starter)

```bash
# Do this separate in both /client and /server folders
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

| Endpoint URL             | Action | Description                                                                                |
| ------------------------ | :----: | ------------------------------------------------------------------------------------------ |
| `/auth/github`           |  GET   | WebApp calls this to start the GitHub login process                                        |
| `/auth/github/callback`  |  GET   | The "auth callback URL" value from your app page on github.com, ALSO inside `/server/.env` |
| `/auth/profile`          |  GET   | Used by React app to get profile. GitHub auth required; checks req.user for login          |
| `/auth/logout`           |  GET   | Used by React app directly. Call passport's logout, ends session, and redirects to React   |
| `/auth/success-callback` |  GET   | A "sanity check" only used when we test GitHub server, in `/server/.env`                   |
| `/api/v1/posts/`         |  GET   | Gets all posts. Adds `isCurrentUser` if the user is logged in (via session)                |
| `/api/v1/posts/`         |  POST  | Create a new post, requires GitHub login                                                   |

## The Workflow

- USER clicks on the link to a URL hosted on the SERVER.(1)
- The SERVER redirects the user to a link to the PROVIDER. (2)
- USER accepts the permission
- PROVIDER redirects to a callback URL on the SERVER
- SERVER will authenticate using passport. If all goes well, we'll get the provider's info of the user.
- the SERVER will map that provider info to a user on the database, or create a new user.
- If all goes well SERVER then redirects to the CLIENT's home page or a failure page depending on the circumstances.

(1) This is different from what we have usually done; up until now, any URL we've it on the server has returned JSON. That's why there's no `/api` in front of it.
(2) This is the modal box where they ask the user if they agree.

## References

### Sessions

- https://flaviocopes.com/express-sessions/
- https://andyj.github.io/projects/node-session-management.html
- https://cesare.substack.com/p/how-to-save-user-sessions-in-the?s=r - may be good if we want to implment connect-session-knex library

### OAuth

- https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth
- https://developer.okta.com/blog/2019/01/23/nobody-cares-about-oauth-or-openid-connect - trolly but has good explanations

### Other implementations

- https://github.com/oktadev/okta-express-react-example/blob/master/index.js
- https://github.com/sahat/hackathon-starter
