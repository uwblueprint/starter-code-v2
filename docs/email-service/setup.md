---
layout: default
title: Setting up Email Service
nav_order: 2
parent: Email Service
---

# Setting up Email Service

1. Navigate to the Google Cloud Platform console and click on your project/create a new project.
2. Navigate to "APIs & Services" on the left pane and click on Credentials.
<img width="1440" alt="image" src="https://user-images.githubusercontent.com/37782734/115771634-311a2000-a37c-11eb-9b2b-2a22f0158c4a.png">

3. Click "Create Credentials" with OAuth Client ID option, and fill in the form (set user type to internal)
4. Navigate back to the Credentials page and click Create Credentials again with OAuth Client ID option. Select "Web Application" and set "Authorised Redirect URIs" to <https://developers.google.com/oauthplayground>
<img width="904" alt="image" src="https://user-images.githubusercontent.com/37782734/115771690-442cf000-a37c-11eb-913d-175e38459b50.png">

5. Click Create and keep the Client ID and secret given.

6. Navigate to <https://developers.google.com/oauthplayground> and click settings. Check off "Use your own OAuth credentials" and fill in the Client ID and secret from Step 5.
<img width="440" alt="image" src="https://user-images.githubusercontent.com/37782734/115772146-c61d1900-a37c-11eb-9d55-5d9629b0927d.png">

7. In the box labelled "Input your own scopes" type <https://mail.google.com/> and click Authorize APIs. 
<img width="486" alt="image" src="https://user-images.githubusercontent.com/37782734/115771751-5018b200-a37c-11eb-8b4d-1495264705e1.png">

8. Click the account you want to use to send emails and grant email permissions.

9. Click “Exchange authorization code for tokens”.
<img width="482" alt="image" src="https://user-images.githubusercontent.com/37782734/115771783-59a21a00-a37c-11eb-90ee-3b98f7453c52.png">

10. Keep the refresh token given.

11. Navigate to the Google Cloud Platform console -> APIs & Services -> Library -> Gmail API, and click Enable.
<img width="949" alt="image" src="https://user-images.githubusercontent.com/37782734/115963717-a3127680-a4ee-11eb-92ec-07be157be3df.png">

12. **If using Python backend:** Add the refresh token, Client ID, and Client secret from above to the root .env file. If you are using auth, please update lines 23-24 in `backend/python/app/rest/auth_routes.py` to be your email and display name.
```
EMAIL_REFRESH_TOKEN=<insert-your-token>
EMAIL_CLIENT_SECRET=<insert-your-secret>
EMAIL_CLIENT_ID=<insert-your-id>
```

13. **If using TypeScript backend:** Create a file named `nodemailer.config.ts` in `backend/typescript` and copy this in:

```ts
import { NodemailerConfig } from "./types";

const config: NodemailerConfig = {
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "your-team-email@uwblueprint.org",
    clientId: "your-client-id",
    clientSecret: "your-client-secret",
    refreshToken: "your-refresh-token"
  },
};

export default config;
```
