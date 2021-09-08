---
layout: default
title: Google Sign-in
nav_order: 8
has_children: true
---

# Google Sign-in

Google OAuth sign-in integration is built into starter-code-v2 to allow users to login with their Google accounts, 
without the need for a password.

The frontend uses react-google-login to display the Google login flow and retrieve the OAuth ID token. This OAuth ID token
is then sent to the backend to login using Firebase.

[Reference](https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-with-oauth-credential)
