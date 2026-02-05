# BrandSnob - Simple Deployment Instructions

## You Need (Already Have ✓):
- ✓ GitHub account
- ✓ Vercel account

## Method 1: GitHub Website (Easiest - No Software Needed)

### Step 1: Create Repository on GitHub (2 minutes)

1. Go to: https://github.com/new

2. Fill in:
   - Repository name: `brandsnob`
   - Description: `Premium brand deals finder`
   - Choose: **Public**
   - ✓ Check "Add a README file"

3. Click: **Create repository**

### Step 2: Upload Files (3 minutes)

1. In your new repository, click: **Add file** → **Upload files**

2. Drag and drop ALL files from the `brandsnob-deploy` folder:
   - package.json
   - vite.config.js
   - tailwind.config.js
   - postcss.config.js
   - index.html
   - vercel.json
   - .gitignore
   - The entire `src` folder (drag the whole folder)

3. Scroll down and click: **Commit changes**

### Step 3: Deploy to Vercel (2 minutes)

1. Go to: https://vercel.com/new

2. Find your `brandsnob` repository in the list

3. Click: **Import**

4. Vercel will auto-detect settings - don't change anything

5. Click: **Deploy**

6. Wait 2-3 minutes for build to complete

7. **Done!** Copy your URL (looks like: `brandsnob-abc123.vercel.app`)

---

## Method 2: GitHub Desktop (If You Prefer Desktop App)

### Step 1: Install GitHub Desktop

1. Download: https://desktop.github.com/
2. Install and open
3. Sign in with your GitHub account

### Step 2: Create Repository

1. Click: **File** → **New Repository**
2. Name: `brandsnob`
3. Local Path: Choose where to save it
4. Click: **Create Repository**

### Step 3: Copy Files

1. Open your new `brandsnob` folder on your computer
2. Copy ALL files from `brandsnob-deploy` into this folder
3. Go back to GitHub Desktop
4. You'll see all files listed

### Step 4: Publish

1. Add commit message: "Initial BrandSnob app"
2. Click: **Commit to main**
3. Click: **Publish repository**
4. Make sure **Public** is selected
5. Click: **Publish Repository**

### Step 5: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Find `brandsnob` repository
3. Click: **Import**
4. Click: **Deploy**
5. Wait 2-3 minutes
6. **Done!** Copy your URL

---

## Troubleshooting

### "Build Failed" Error

1. Check that you uploaded ALL files, especially:
   - package.json
   - vite.config.js
   - The entire `src` folder with all 3 files inside

2. Make sure files are in the ROOT of the repository, not in a subfolder

3. If still failing, check the build logs in Vercel for specific error

### "404 Not Found" Error

1. Wait 5 minutes and try again (sometimes takes time to propagate)
2. Try clearing browser cache (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
3. Make sure `index.html` is in the root folder
4. Check that `dist` folder was created during build (Vercel will show this)

### Files Not Showing on GitHub

1. Make sure you're uploading to the ROOT of the repository
2. Don't create nested folders
3. The `src` folder should contain: App.jsx, main.jsx, index.css

---

## File Structure Should Look Like This:

```
brandsnob/                  ← Your repository
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── .gitignore
```

---

## After Successful Deploy

Your app will be live at: `https://brandsnob-[random].vercel.app`

**To get a cleaner URL:**
1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Change to: `brandsnob.vercel.app` (if available)

---

## Need Help?

If you get stuck at any step, let me know:
- What step you're on
- What error message you see (if any)
- Screenshot of the problem

I'll help you troubleshoot!
