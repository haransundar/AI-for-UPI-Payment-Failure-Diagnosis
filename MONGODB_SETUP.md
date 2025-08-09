# MongoDB Integration Setup Guide

## 🚀 **MongoDB Integration Complete!**

Your UPI Payment Failure Diagnosis platform now includes full MongoDB integration with real-time data storage, advanced querying, and scalable analytics.

---

## 📋 **MongoDB Setup Options**

### **Option 1: Local MongoDB (Recommended for Development)**

#### **Install MongoDB Community Edition**

**Windows:**
```bash
# Download and install from: https://www.mongodb.com/try/download/community
# Or use Chocolatey
choco install mongodb

# Start MongoDB service
net start MongoDB
```

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### **Verify Installation**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Should return: { ok: 1 }
```

### **Option 2: MongoDB Atlas (Cloud - Recommended for Production)**

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0) for development
3. **Get Connection String**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/upi_diagnosis
   ```
4. **Update Environment**: Add to your `.env` file

### **Option 3: Docker MongoDB (Quick Setup)**

```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:7.0

# Connection string for Docker
MONGODB_URL=mongodb://admin:password@localhost:27017/upi_diagnosis?authSource=admin
```

---

## ⚙️ **Environment Configuration**

Update your `.env` file with MongoDB settings:

```bash
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=upi_diagnosis

# For MongoDB Atlas (cloud)
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/

# For Docker with authentication
# MONGODB_URL=mongodb://admin:password@localhost:27017/upi_diagnosis?authSource=admin
```

---

## 🔧 **Backend Dependencies**

Install the new MongoDB dependencies:

```bash
cd backend
pip install motor pymongo dnspython
```

Or install from updated requirements.txt:
```bash
pip install -r requirements.txt
```

---

## 🚀 **Starting the System**

### **1. Start MongoDB**
```bash
# Local MongoDB
mongod

# Or if installed as service (Windows)
net start MongoDB

# Or if using Docker
docker start mongodb
```

### **2. Start Backend**
```bash
cd backend
python main.py
```

**Expected Output:**
```
🔄 Loading transaction data...
✅ Connected to MongoDB successfully
📊 No existing data found, generating synthetic data...
🔄 Generating synthetic UPI transaction data...
✅ Inserted 1000 transactions into MongoDB
📊 Generated and cached 1000 synthetic transactions
✅ Transaction data loaded successfully
🔄 Initializing diagnosis service...
✅ Diagnosis service initialized successfully
🚀 UPI Diagnosis API startup completed successfully!
```

### **3. Start Frontend**
```bash
cd frontend
npm start
```

---

## 📊 **New MongoDB-Powered Features**

### **Enhanced API Endpoints**

#### **1. Advanced Transaction Filtering**
```bash
# Get transactions with pagination
GET /transactions?limit=50&skip=100

# Search transactions
GET /transactions?search=TXN001

# Filter by failure type
GET /transactions?failure_type=insufficient_funds

# Combined filtering
GET /transactions?limit=20&failure_type=network_issue&search=HDFC
```

#### **2. Real-time Statistics**
```bash
# Get comprehensive stats
GET /transactions/stats

# Response:
{
  "total_transactions": 1000,
  "failed_transactions": 300,
  "successful_transactions": 700,
  "pending_transactions": 0,
  "total_amount": 15750000.50,
  "avg_amount": 15750.50,
  "success_rate": 70.0
}
```

#### **3. Analytics Data**
```bash
# Get hourly analytics for charts
GET /analytics/hourly?days=7

# Get failure type distribution
GET /failure-types
```

#### **4. Database Health Check**
```bash
# Check MongoDB connection
GET /database/health

# Response:
{
  "status": "healthy",
  "connected": true,
  "transactions_count": 1000,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **Automatic Fallback System**

If MongoDB is not available, the system automatically falls back to:
1. **CSV file storage** (existing data)
2. **In-memory storage** (new synthetic data)
3. **Mock data** for analytics

---

## 🗄️ **Database Schema**

### **Transactions Collection**
```javascript
{
  _id: ObjectId,
  transaction_id: "TXN000001",
  timestamp: ISODate,
  amount: 1500.00,
  sender_vpa: "user1234@paytm",
  receiver_vpa: "merchant567@phonepe",
  sender_bank: "HDFC",
  receiver_bank: "ICICI",
  status: "failed",
  failure_reason: "Insufficient balance in account",
  failure_type: "insufficient_funds",
  error_code: "E001",
  retry_count: 2,
  metadata: {
    device: "mobile",
    app_version: "1.2.3"
  },
  created_at: ISODate,
  updated_at: ISODate
}
```

### **Indexes Created**
- `transaction_id` (unique)
- `timestamp` (for time-based queries)
- `status` (for filtering)
- `failure_type` (for analytics)
- `sender_vpa`, `receiver_vpa` (for search)
- Compound index: `timestamp + status`

---

## 🔍 **MongoDB Management**

### **Using MongoDB Compass (GUI)**
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27017`
3. Browse `upi_diagnosis` database
4. View `transactions` collection

### **Using MongoDB Shell**
```bash
# Connect to MongoDB
mongosh

# Switch to database
use upi_diagnosis

# View collections
show collections

# Count transactions
db.transactions.countDocuments()

# Find failed transactions
db.transactions.find({status: "failed"}).limit(5)

# Get failure type distribution
db.transactions.aggregate([
  {$match: {failure_type: {$ne: null}}},
  {$group: {_id: "$failure_type", count: {$sum: 1}}},
  {$sort: {count: -1}}
])
```

---

## 📈 **Performance Benefits**

### **MongoDB vs CSV/Memory Storage**

| Feature | CSV/Memory | MongoDB |
|---------|------------|---------|
| **Data Persistence** | Limited | ✅ Persistent |
| **Concurrent Access** | Limited | ✅ Multi-user |
| **Advanced Queries** | Basic | ✅ Complex aggregations |
| **Indexing** | None | ✅ Multiple indexes |
| **Scalability** | Limited | ✅ Horizontal scaling |
| **Real-time Analytics** | Basic | ✅ Advanced pipelines |
| **Data Integrity** | Basic | ✅ ACID transactions |

### **Query Performance**
- **Indexed queries**: Sub-millisecond response times
- **Aggregation pipelines**: Real-time analytics
- **Pagination**: Efficient large dataset handling
- **Search**: Full-text search capabilities

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. MongoDB Connection Failed**
```
❌ Failed to connect to MongoDB: ServerSelectionTimeoutError
```
**Solution:**
- Check if MongoDB is running: `mongosh --eval "db.adminCommand('ping')"`
- Verify connection string in `.env`
- Check firewall settings

#### **2. Authentication Failed**
```
❌ Authentication failed
```
**Solution:**
- Check username/password in connection string
- Verify database permissions
- For Atlas: Check IP whitelist

#### **3. Database Not Found**
```
❌ Database 'upi_diagnosis' not found
```
**Solution:**
- Database is created automatically on first write
- Check `DATABASE_NAME` in `.env`
- Verify connection string

### **Fallback Mode**
If MongoDB fails, you'll see:
```
⚠️ MongoDB connection failed, falling back to CSV/memory storage
```
The system continues working with limited functionality.

---

## 🎯 **Production Deployment**

### **MongoDB Atlas (Recommended)**
1. **Create Production Cluster**
2. **Configure Network Access** (IP whitelist)
3. **Set up Database Users** with appropriate permissions
4. **Enable Monitoring** and alerts
5. **Configure Backups** (automatic in Atlas)

### **Self-Hosted MongoDB**
1. **Enable Authentication**
2. **Configure Replica Sets** for high availability
3. **Set up Monitoring** (MongoDB Ops Manager)
4. **Configure Backups** (mongodump/mongorestore)
5. **Secure Network Access** (firewall, VPN)

### **Environment Variables (Production)**
```bash
# Production MongoDB Atlas
MONGODB_URL=mongodb+srv://prod_user:secure_password@production-cluster.mongodb.net/upi_diagnosis_prod?retryWrites=true&w=majority
DATABASE_NAME=upi_diagnosis_prod

# Connection pool settings
MONGODB_MAX_POOL_SIZE=50
MONGODB_MIN_POOL_SIZE=5
```

---

## ✅ **Verification Checklist**

- [ ] MongoDB is installed and running
- [ ] Backend connects to MongoDB successfully
- [ ] Synthetic data is generated and stored
- [ ] API endpoints return data from MongoDB
- [ ] Frontend displays real-time data
- [ ] Search and filtering work correctly
- [ ] Analytics charts show MongoDB data
- [ ] Database health check passes
- [ ] Fallback system works when MongoDB is offline

---

## 🎉 **Success!**

Your UPI Payment Failure Diagnosis platform now has:

✅ **Full MongoDB Integration** - Real-time data storage and retrieval
✅ **Advanced Querying** - Complex filters, search, and pagination
✅ **Scalable Analytics** - Real-time aggregation pipelines
✅ **Production Ready** - Robust error handling and fallback systems
✅ **Performance Optimized** - Indexed queries and efficient data access

**Your platform is now enterprise-ready with MongoDB powering the backend!** 🚀