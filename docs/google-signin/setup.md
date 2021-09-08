---
layout: default
title: Setting up Google Sign-in
nav_order: 1
parent: Google Sign-in
---

# Setting up Google Sign-in

1. Navigate to the Google Cloud Platform console and click on your project/create a new project.
2. Navigate to "APIs & Services" on the left pane and click on Credentials.
<img width="1440" alt="image" src="https://user-images.githubusercontent.com/37782734/115771634-311a2000-a37c-11eb-9b2b-2a22f0158c4a.png">

3. If using an existing OAuth client, select it. Otherwise, click "Create Credentials" with OAuth Client ID option, and select "Web Application".
<img width="904" alt="image" src="https://user-images.githubusercontent.com/37782734/115771690-442cf000-a37c-11eb-913d-175e38459b50.png">

4. Set "Authorized JavaScript origins" to your site's URL (or http://localhost:3000 for testing).

5. If creating a new OAuth client, click Create and keep the Client ID given.

6. Navigate to "OAuth consent screen" on the left pane. Change the user type to "External" with "Testing" publishing status.
This allows emails outside the Blueprint org to login. 
<img width="222" alt="image" src="https://user-images.githubusercontent.com/37782734/132543842-46309242-c0a2-4f9d-bd3d-5b96048ede92.png">
<img width="816" alt="image" src="https://user-images.githubusercontent.com/37782734/132544213-705b326b-3357-4f0d-b3b7-68bbbb56796e.png">

7. Add Test Users for local development.
<img width="461" alt="image" src="https://user-images.githubusercontent.com/37782734/132544445-8a9f5f5d-3f24-4949-87a2-2cfc473bab50.png">

8. Navigate to the [Firebase console](https://console.firebase.google.com) for your project -> Build -> Authentication.
<img width="1433" alt="image" src="https://user-images.githubusercontent.com/37782734/132542543-8d5da243-b851-43e6-b1aa-18bd3f666e7a.png">

9. Click the Sign-in method tab and enable the Google provider.
<img width="1076" alt="image" src="https://user-images.githubusercontent.com/37782734/132542811-668331d0-2f4c-4ad5-9dd2-432c2937ca76.png">

10. Add the OAuth Client ID to your frontend .env file. Otherwise, your Google login button will be greyed out on the frontend.
```
REACT_APP_OAUTH_CLIENT_ID=<insert-your-client-id>
```
