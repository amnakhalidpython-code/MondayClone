# MongoDB Connection Troubleshooting Guide

## Error: `queryTxt ETIMEOUT cluster0.xjduzm0.mongodb.net`

This error means the backend cannot connect to MongoDB Atlas. Here are the solutions:

---

## ✅ Solution 1: Whitelist Your IP Address in MongoDB Atlas

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Log in to your account

2. **Navigate to Network Access**
   - Click on "Network Access" in the left sidebar
   - Or go to: Security → Network Access

3. **Add IP Address**
   - Click "ADD IP ADDRESS" button
   - Choose one of these options:

   **Option A: Allow Access from Anywhere (Recommended for Development)**
   - Click "ALLOW ACCESS FROM ANYWHERE"
   - This adds `0.0.0.0/0` to the whitelist
   - Click "Confirm"

   **Option B: Add Your Current IP**
   - Click "ADD CURRENT IP ADDRESS"
   - Your IP will be automatically detected
   - Click "Confirm"

4. **Wait for Changes to Apply**
   - It may take 1-2 minutes for the changes to propagate
   - You'll see a green "Active" status when ready

---

## ✅ Solution 2: Check Your MongoDB Connection String

1. **Verify .env file**
   ```bash
   cd "/Users/umar/Desktop/Monday Project/MondayClone"
   cat .env
   ```

2. **Ensure MONGO_URI is correct**
   It should look like:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xjduzm0.mongodb.net/dbname?retryWrites=true&w=majority
   ```

3. **Common Issues:**
   - ❌ Missing password
   - ❌ Special characters in password not URL-encoded
   - ❌ Wrong database name
   - ❌ Missing `?retryWrites=true&w=majority`

---

## ✅ Solution 3: Check Internet Connection

1. **Test MongoDB connectivity**
   ```bash
   ping cluster0.xjduzm0.mongodb.net
   ```

2. **Test DNS resolution**
   ```bash
   nslookup cluster0.xjduzm0.mongodb.net
   ```

3. **If behind a firewall/VPN:**
   - Disable VPN temporarily
   - Check corporate firewall settings
   - MongoDB Atlas uses port 27017 (ensure it's not blocked)

---

## ✅ Solution 4: Use Local MongoDB (Alternative)

If you can't connect to MongoDB Atlas, use a local MongoDB instance:

1. **Install MongoDB locally**
   ```bash
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

3. **Update .env**
   ```
   MONGO_URI=mongodb://localhost:27017/monday-clone
   ```

4. **Restart backend server**
   ```bash
   npm run dev
   ```

---

## ✅ Quick Fix: Restart Backend Server

After making any changes:

```bash
cd "/Users/umar/Desktop/Monday Project/MondayClone"
npm run dev
```

Watch for this message:
```
✅ MongoDB connected: cluster0-shard-00-00.xjduzm0.mongodb.net
```

---

## 🔍 Verify Connection is Working

1. **Check backend logs**
   - Look for: `✅ MongoDB connected: ...`
   - If you see this, connection is successful!

2. **Test API endpoint**
   ```bash
   curl http://localhost:5000/api/health
   ```

   Should return:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "..."
   }
   ```

3. **Test donors endpoint**
   ```bash
   curl http://localhost:5000/api/donors
   ```

---

## 📝 Most Common Solution

**90% of the time, the issue is IP whitelisting.**

Quick steps:
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Click "ALLOW ACCESS FROM ANYWHERE"
4. Wait 1-2 minutes
5. Restart your backend server

---

## Need More Help?

If none of these solutions work:

1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Review MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
3. Check your MongoDB Atlas cluster is running (not paused)
4. Verify your MongoDB Atlas account is active

---

## Current Configuration

The backend is configured with:
- Connection timeout: 30 seconds
- Socket timeout: 45 seconds
- Server selection timeout: 30 seconds

These settings should handle most network delays.
