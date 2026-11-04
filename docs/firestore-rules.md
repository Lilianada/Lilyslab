# Firestore rules

These rules are the complete rule set for the site. In the Firebase console, go to **Firestore Database > Rules**, replace everything with the block below, and click **Publish**.

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && get(/databases/$(database)/documents/admins/$(request.auth.token.email.lower())).data.isAdmin == true;
    }

    // Checked one email at a time. Nobody can list who the admins are.
    match /admins/{email} {
      allow get: if true;
      allow update: if isAdmin()
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isLoggedIn', 'lastUpdated']);
    }

    // Must stay publicly readable and updatable until the AMA routes move to the Admin SDK.
    match /ama-questions/{id} {
      allow read: if true;
      allow create: if request.resource.data.response == '';
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['response', 'responseDate', 'notifiedAt']);
    }

    // Must stay publicly readable until the guestbook route moves to the Admin SDK.
    match /guestbook/{id} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['name', 'email', 'url', 'message', 'createdAt', 'date']);
    }

    // Intro audio play count
    match /audioStats/{id} {
      allow get: if true;
      allow create, update: if request.resource.data.keys().hasOnly(['playCount']);
    }

    // Visitor counter. The site's server writes these without signing in.
    match /visitorStats/{id} {
      allow read: if isAdmin();
      allow create, update: if request.resource.data.keys().hasOnly(['visitors', 'referrers', 'landings', 'countries']);
    }

    // Suggestion form
    match /suggestions/{id} {
      allow create: if request.resource.data.reviewed == false;
      allow read, update: if isAdmin();
    }

    // Webroll "Leave a link" form
    match /webroll-submissions/{id} {
      allow create: if request.resource.data.reviewed == false;
      allow read, update: if isAdmin();
    }

    // Tool submission form
    match /tool-submissions/{id} {
      allow create: if true;
      allow read: if isAdmin();
    }
  }
}
```

Any collection not listed here is blocked. The Firebase console itself ignores these rules, so you can still view and edit everything there.

## What these rules can't protect yet

The site's server talks to Firestore without signing in, so some access has to stay public until those routes move to the Firebase Admin SDK:

- **`ama-questions` and `guestbook` emails** can still be read by anyone.
- **AMA replies** can still be changed by anyone who writes directly to Firestore.
- **Visitor counts** can be inflated, but not read.
