# Firebase Admin key and Firestore rules

The site's server uses the Firebase Admin SDK, which ignores Firestore rules. That means the rules can keep the public out of everything except the few things a browser needs directly.

**Do these steps in order.** If you publish the rules before the new code is live, the guestbook and AMA will stop working.

## 1. Create the key

1. In the [Firebase console](https://console.firebase.google.com), open your project.
2. Click the gear icon, then **Project settings > Service accounts**.
3. Click **Generate new private key**. A `.json` file downloads.

Keep this file out of the repo and never share it. It gives full access to your Firebase project.

## 2. Add it to Vercel and your computer

Turn the key into one line and copy it (use your file's real name):

```
base64 -i ~/Downloads/your-key-file.json | pbcopy
```

- **Vercel:** go to **Settings > Environment Variables** and add `FIREBASE_SERVICE_ACCOUNT_BASE64`, pasting the value.
- **Your computer:** add `FIREBASE_SERVICE_ACCOUNT_BASE64=<paste>` to `.env.local`.

Then delete the downloaded file. If the key ever leaks, delete it under **Service accounts** in Google Cloud and create a new one.

## 3. Deploy and test

Run `yarn install`, commit, and deploy. Then check that these work on the live site:

- The guestbook and AMA pages load, and you can sign the guestbook.
- You can reply to a test AMA question.
- The CTRL Room loads.

## 4. Publish these rules

In **Firestore Database > Rules**, replace everything with this and click **Publish**:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && get(/databases/$(database)/documents/admins/$(request.auth.token.email.lower())).data.isAdmin == true;
    }

    // The browser checks one email at a time. Nobody can list who the admins are.
    match /admins/{email} {
      allow get: if true;
      allow update: if isAdmin()
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isLoggedIn', 'lastUpdated']);
    }

    // Intro audio play count, read and updated by visitors' browsers.
    match /audioStats/{id} {
      allow get: if true;
      allow create, update: if request.resource.data.keys().hasOnly(['playCount']);
    }

    // CTRL Room reads these directly while signed in.
    match /visitorStats/{id} {
      allow read: if isAdmin();
    }

    match /suggestions/{id} {
      allow read: if isAdmin();
      allow update: if isAdmin() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['reviewed']);
    }

    match /webroll-submissions/{id} {
      allow read: if isAdmin();
      allow update: if isAdmin() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['reviewed']);
    }
  }
}
```

Anything not listed, including `ama-questions`, `guestbook` and `tool-submissions`, is closed to the public. The site's server and the Firebase console can still reach it.

## 5. Test again

Repeat the checks from step 3, and also confirm the intro audio's play count goes up and the CTRL Room inbox's **Done** button works. If something breaks, restore the previous version from the rules history in the **Rules** tab.
