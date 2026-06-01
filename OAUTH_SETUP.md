# 🛠️ OAuth Setup Guide for GitHub, Twitter/X & LinkedIn

This guide explains how to properly configure your OAuth Apps to fix authorization errors and successfully connect all social media integrations.

---

## 🐙 1. GitHub OAuth App Setup

> [!WARNING]
> Do **NOT** create a **GitHub App**. You must create a **GitHub OAuth App**. 
> GitHub Apps have restricted repository creation scopes for user-to-server tokens unless complex organization installations are done. Standard **OAuth Apps** work seamlessly.

### Step-by-Step Instructions:
1. Go to your **GitHub Settings** (click your profile picture in the top-right → **Settings**).
2. On the left sidebar, scroll down to the bottom and click **Developer settings**.
3. Under the **OAuth Apps** tab (do not choose GitHub Apps), click **New OAuth App** (or **Register a new application**).
4. Fill in the fields exactly as follows:
   - **Application name**: `Aether Canvas` (or any name you prefer)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback`
5. Click the green **Register application** button.
6. Once registered:
   - Copy the **Client ID**.
   - Click **Generate a new client secret** and copy the generated **Client Secret**.

---

## 🐦 2. Twitter/X OAuth 2.0 App Setup

To connect to X (Twitter), you must configure an **OAuth 2.0 Web Application** in the Twitter Developer Portal.

### Step-by-Step Instructions:
1. Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).
2. Click on **Projects & Apps** on the left menu, select your Project, and click on your App (or create a new App under a Project).
3. In the App's settings tab, scroll down to the **User authentication settings** section and click **Set up** (or **Edit** if already configured).
4. Configure the settings exactly as follows:
   - **App permissions**: Select **Read and write** (this allows reading profiles and posting tweets).
   - **Type of App**: Select **Web App, Automated App or Bot** (This is critical. Do **NOT** choose Native App).
   - **App Info**:
     - **Callback URI / Redirect URL**: `http://localhost:3000/api/auth/callback` *(Must match exactly!)*
     - **Website URL**: `http://localhost:3000`
5. Click **Save** at the bottom.
6. Once saved, X will show you:
   - **Client ID**
   - **Client Secret** (Make sure to copy this client secret; it is different from your Consumer API Keys!).

---

## 🔗 3. LinkedIn App Setup

LinkedIn requires all developer applications to be linked to a **LinkedIn Company Page** (rather than a personal profile) and requires adding specific products for sharing permissions.

### Step-by-Step Instructions:
1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/) and click **Create app**.
2. Fill in the fields:
   - **App name**: `Xonnector` (or any name)
   - **LinkedIn Page**: LinkedIn requires linking a Company Page. 
     - *If you don't have one:* Click the **"+ Create a new LinkedIn Page"** link right below the input box. It takes 1-2 minutes to create a free placeholder page (select "Company" or "Small Business", fill in a name like "Xonnector Dev", and save). Once created, search and select it in the **LinkedIn Page** field.
   - **Privacy policy URL**: Enter `http://localhost:3000/privacy` or any placeholder link (e.g. `https://google.com`).
   - **App logo**: Upload any square image (such as a placeholder icon or logo).
3. Check the legal agreement box and click **Create app**.
4. Configure OAuth Redirects:
   - Click the **Auth** tab at the top of your app console.
   - Under the **Authorized redirect URLs for your app** section, click the edit pencil icon and add:
     `http://localhost:3000/api/auth/callback`
   - Click **Update**.
5. Enable Products (Permissions):
   - Go to the **Products** tab.
   - Find **Share on LinkedIn** and click **Request access** (this enables the `w_member_social` permission to post content). It is approved instantly for free.
   - Find **Sign In with LinkedIn using OpenID Connect** (or **Sign In with LinkedIn**) and click **Request access** (this enables `r_liteprofile` to fetch your name/avatar). Approved instantly.
6. Copy Credentials:
   - Go back to the **Auth** tab.
   - Copy the **Client ID** and **Client Secret**.

---

## ⚙️ 4. Updating your `.env` File

Open your [`.env`](file:///Users/chinmaybhatt/SocialConnectors/aether-canvas/.env) file in the root of the project and replace the existing values with your new keys:

```env
# GitHub OAuth (Create under Developer Settings -> OAuth Apps)
GITHUB_CLIENT_ID="YOUR_GITHUB_OAUTH_CLIENT_ID"
GITHUB_CLIENT_SECRET="YOUR_GITHUB_OAUTH_CLIENT_SECRET"

# LinkedIn OAuth (Create under LinkedIn Developer Portal)
LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID"
LINKEDIN_CLIENT_SECRET="YOUR_LINKEDIN_CLIENT_SECRET"

# Twitter/X OAuth 2.0 (Create under Developer Portal -> User Auth Settings -> Web App)
TWITTER_CLIENT_ID="YOUR_TWITTER_OAUTH2_CLIENT_ID"
TWITTER_CLIENT_SECRET="YOUR_TWITTER_OAUTH2_CLIENT_SECRET"
```

---

## 🔄 5. Testing Your Changes

1. **Restart your server**: In your terminal, stop the server (`Ctrl + C`) and run `npm run dev` again to load the new `.env` variables.
2. **Clear previous session**:
   - In the Aether Canvas UI, click on the **LinkedIn**, **GitHub** or **X** icon to disconnect (if it was showing as connecting or connected).
   - Alternatively, open your browser's Developer Tools (F12) → Application → Local Storage → `http://localhost:3000` and clear any keys starting with `token-` (e.g. `token-linkedin`).
   - Refresh the page.
3. **Connect**: Click **Connect** for LinkedIn on the canvas and complete the OAuth flow in the popup.
4. **Run Automation**: Try typing `"post a LinkedIn update about NextgenAI"` in the chat, and click **Run Automation** to post a live update to your LinkedIn profile!
