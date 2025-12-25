# Donor Management API Documentation

## Overview
This API provides a complete backend system for managing donors with dynamic custom fields, similar to Monday.com and Airtable.

## Base URL
```
http://localhost:5000/api
```

## Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": { ... }
}
```

---

## Donor Endpoints

### 1. Get All Donors
**GET** `/donors`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in name, email, phone
- `sortBy` (optional): Field to sort by (default: createdAt)
- `order` (optional): asc | desc (default: desc)
- `status` (optional): potential | active | inactive

**Example Request:**
```
GET /api/donors?page=1&limit=10&search=john&sortBy=donor_name&order=asc&status=active
```

**Example Response:**
```json
{
  "success": true,
  "message": "Donors retrieved successfully",
  "data": {
    "donors": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "donor_name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "total_donated": 5000,
        "total_donations": 3,
        "status": "active",
        "files": [],
        "customFields": {
          "company": "Acme Corp",
          "notes": "VIP donor"
        },
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

### 2. Get Single Donor
**GET** `/donors/:id`

**Example Response:**
```json
{
  "success": true,
  "message": "Donor retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "donor_name": "John Doe",
    "email": "john@example.com",
    "customFields": {
      "company": "Acme Corp"
    }
  }
}
```

---

### 3. Create Donor
**POST** `/donors`

**Request Body:**
```json
{
  "donor_name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "total_donated": 0,
  "total_donations": 0,
  "status": "potential"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Donor created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "donor_name": "Jane Smith",
    "email": "jane@example.com",
    ...
  }
}
```

---

### 4. Update Donor
**PATCH** `/donors/:id`

**Request Body:**
```json
{
  "donor_name": "Jane Doe",
  "total_donated": 1000,
  "status": "active"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Donor updated successfully",
  "data": { ... }
}
```

---

### 5. Delete Donor
**DELETE** `/donors/:id`

**Example Response:**
```json
{
  "success": true,
  "message": "Donor deleted successfully",
  "data": { ... }
}
```

---

### 6. Update Custom Field
**PATCH** `/donors/:id/custom`

**Request Body:**
```json
{
  "column_key": "company",
  "value": "New Company Name"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Custom field updated successfully",
  "data": {
    "_id": "...",
    "donor_id": "507f1f77bcf86cd799439011",
    "column_key": "company",
    "value": "New Company Name"
  }
}
```

---

### 7. Upload File
**POST** `/donors/:id/files`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: The file to upload

**Allowed File Types:**
- Images: JPEG, PNG
- Documents: PDF, DOC, DOCX, TXT
- Spreadsheets: XLS, XLSX, CSV

**Max File Size:** 10MB

**Example Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "document-1234567890.pdf",
    "originalName": "document.pdf",
    "path": "/uploads/donors/document-1234567890.pdf",
    "mimetype": "application/pdf",
    "size": 102400,
    "uploadedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 8. Get Donor Files
**GET** `/donors/:id/files`

**Example Response:**
```json
{
  "success": true,
  "message": "Files retrieved successfully",
  "data": [
    {
      "filename": "document-1234567890.pdf",
      "originalName": "document.pdf",
      "path": "/uploads/donors/document-1234567890.pdf",
      "mimetype": "application/pdf",
      "size": 102400,
      "uploadedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Column Endpoints

### 1. Get All Columns
**GET** `/columns`

**Query Parameters:**
- `includeInactive` (optional): true | false (default: false)

**Example Response:**
```json
{
  "success": true,
  "message": "Columns retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "column_key": "company",
      "title": "Company",
      "type": "text",
      "width": 200,
      "order": 0,
      "isRequired": false,
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Column
**GET** `/columns/:id`

---

### 3. Create Column
**POST** `/columns/add`

**Request Body:**
```json
{
  "column_key": "company",
  "title": "Company",
  "type": "text",
  "width": 200,
  "order": 0,
  "isRequired": false
}
```

**Column Types:**
- `text` - Plain text
- `number` - Numeric values
- `email` - Email addresses
- `phone` - Phone numbers
- `date` - Date values
- `status` - Status with color options
- `checkbox` - Boolean checkbox
- `dropdown` - Dropdown selection
- `file` - File attachment
- `person` - Person/user reference
- `link` - URL link

**Example Response:**
```json
{
  "success": true,
  "message": "Column created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "column_key": "company",
    "title": "Company",
    "type": "text",
    ...
  }
}
```

---

### 4. Update Column
**PATCH** `/columns/:id`

**Request Body:**
```json
{
  "title": "Company Name",
  "width": 250,
  "isRequired": true
}
```

---

### 5. Delete Column
**DELETE** `/columns/:id`

**Query Parameters:**
- `permanent` (optional): true | false (default: false)
  - `false`: Soft delete (sets isActive to false)
  - `true`: Permanent delete (removes column and all values)

---

### 6. Reorder Columns
**PATCH** `/columns/reorder`

**Request Body:**
```json
{
  "columnOrders": [
    { "id": "507f1f77bcf86cd799439013", "order": 0 },
    { "id": "507f1f77bcf86cd799439014", "order": 1 },
    { "id": "507f1f77bcf86cd799439015", "order": 2 }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Email is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Donor not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Something went wrong!",
  "error": "Error details..."
}
```

---

## Database Schema

### Donor Collection
```javascript
{
  donor_name: String (required),
  email: String (required, unique),
  phone: String,
  total_donated: Number (default: 0),
  total_donations: Number (default: 0),
  status: String (enum: ['potential', 'active', 'inactive']),
  files: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### DynamicColumn Collection
```javascript
{
  column_key: String (required, unique),
  title: String (required),
  type: String (enum: column types),
  options: Mixed,
  width: Number (default: 150),
  order: Number (default: 0),
  isRequired: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### DonorColumnValue Collection
```javascript
{
  donor_id: ObjectId (ref: Donor),
  column_key: String,
  value: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Usage Examples

### Frontend Integration Example

```javascript
// Fetch all donors with pagination
const fetchDonors = async (page = 1, search = '') => {
  const response = await fetch(
    `http://localhost:5000/api/donors?page=${page}&limit=10&search=${search}`
  );
  const data = await response.json();
  return data;
};

// Create a new donor
const createDonor = async (donorData) => {
  const response = await fetch('http://localhost:5000/api/donors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donorData)
  });
  return await response.json();
};

// Update custom field
const updateCustomField = async (donorId, columnKey, value) => {
  const response = await fetch(
    `http://localhost:5000/api/donors/${donorId}/custom`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column_key: columnKey, value })
    }
  );
  return await response.json();
};

// Upload file
const uploadFile = async (donorId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(
    `http://localhost:5000/api/donors/${donorId}/files`,
    {
      method: 'POST',
      body: formData
    }
  );
  return await response.json();
};

// Add new column
const addColumn = async (columnData) => {
  const response = await fetch('http://localhost:5000/api/columns/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(columnData)
  });
  return await response.json();
};
```

---

## Testing the API

You can test the API using tools like:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl**
- **Insomnia**

### Example curl commands:

```bash
# Get all donors
curl http://localhost:5000/api/donors

# Create a donor
curl -X POST http://localhost:5000/api/donors \
  -H "Content-Type: application/json" \
  -d '{"donor_name":"John Doe","email":"john@example.com"}'

# Add a column
curl -X POST http://localhost:5000/api/columns/add \
  -H "Content-Type: application/json" \
  -d '{"column_key":"company","title":"Company","type":"text"}'
```

---

## Notes

1. All timestamps are in ISO 8601 format
2. File uploads are stored in `/uploads/donors/` directory
3. Soft-deleted columns can be restored by setting `isActive: true`
4. Custom field values are automatically created when first set
5. Deleting a donor also deletes all associated custom field values
6. Column keys must be lowercase with underscores only (e.g., `company_name`)
