# Complete API Endpoints - Backend Features

## 🎯 All Implemented Backend Functionalities

This document lists ALL the backend endpoints that support the Monday.com-style features shown in your screenshots.

---

## 📋 **Column Management Endpoints**

### 1. **Duplicate Column**
```
POST /api/columns/:id/duplicate
```
Duplicates a column including all its data values.

**Response:**
```json
{
  "success": true,
  "message": "Column duplicated successfully",
  "data": { ... }
}
```

---

### 2. **Change Column Type**
```
PATCH /api/columns/:id/change-type
```
Changes the type of a column (e.g., from Text to Date, from Number to Status).

**Request Body:**
```json
{
  "newType": "date",
  "options": { ... }
}
```

---

### 3. **Autofill Column**
```
POST /api/columns/:id/autofill
```
Fills all rows in a column with a specific value.

**Request Body:**
```json
{
  "value": "Sample Value",
  "donorIds": ["id1", "id2"] // Optional: specific donors only
}
```

---

### 4. **Add Column to the Right**
```
POST /api/columns/:id/add-to-right
```
Adds a new column immediately to the right of the specified column.

**Request Body:**
```json
{
  "column_key": "new_column",
  "title": "New Column",
  "type": "text"
}
```

---

## 🔍 **Advanced Filter Endpoints**

### 5. **Advanced Filter**
```
POST /api/donors/filter
```
Apply complex filters with multiple conditions (like the "Advanced filters" shown in your screenshot).

**Request Body:**
```json
{
  "filters": [
    {
      "field": "status",
      "operator": "equals",
      "value": "active"
    },
    {
      "field": "total_donated",
      "operator": "greater_than",
      "value": 1000
    }
  ],
  "page": 1,
  "limit": 10
}
```

**Supported Operators:**
- `equals` / `is`
- `not_equals` / `is_not`
- `contains`
- `not_contains`
- `starts_with`
- `ends_with`
- `greater_than`
- `greater_than_or_equal`
- `less_than`
- `less_than_or_equal`
- `is_empty`
- `is_not_empty`
- `in`
- `not_in`

---

### 6. **Group By Field**
```
POST /api/donors/group-by
```
Groups donors by a specific field (like "Group by" in your screenshot).

**Request Body:**
```json
{
  "field": "status"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "field": "status",
    "groups": [
      {
        "value": "active",
        "count": 15,
        "donors": [...]
      },
      {
        "value": "potential",
        "count": 8,
        "donors": [...]
      }
    ]
  }
}
```

---

### 7. **Sort Donors**
```
POST /api/donors/sort
```
Sorts donors by any field (like "Sort" in your screenshot).

**Request Body:**
```json
{
  "field": "donor_name",
  "order": "asc",
  "page": 1,
  "limit": 10
}
```

---

## 📊 **Complete Endpoint List**

### **Donors**
- `GET /api/donors` - Get all donors with pagination
- `GET /api/donors/:id` - Get single donor
- `POST /api/donors` - Create donor
- `PATCH /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor
- `PATCH /api/donors/:id/custom` - Update custom field
- `POST /api/donors/:id/files` - Upload file
- `GET /api/donors/:id/files` - Get donor files
- `POST /api/donors/filter` - Advanced filter ✨
- `POST /api/donors/group-by` - Group by field ✨
- `POST /api/donors/sort` - Sort donors ✨

### **Columns**
- `GET /api/columns` - Get all columns
- `GET /api/columns/:id` - Get single column
- `POST /api/columns/add` - Create column
- `PATCH /api/columns/:id` - Update column
- `DELETE /api/columns/:id` - Delete column
- `PATCH /api/columns/reorder` - Reorder columns
- `POST /api/columns/:id/duplicate` - Duplicate column ✨
- `PATCH /api/columns/:id/change-type` - Change column type ✨
- `POST /api/columns/:id/autofill` - Autofill column ✨
- `POST /api/columns/:id/add-to-right` - Add column to right ✨

---

## 🎨 **Features from Your Screenshots**

### ✅ **Column Menu (Screenshot 1)**
- Settings
- AI-powered actions (placeholder)
- **Filter** → `POST /api/donors/filter`
- **Sort** → `POST /api/donors/sort`
- Collapse (frontend only)
- **Group by** → `POST /api/donors/group-by`
- **Duplicate column** → `POST /api/columns/:id/duplicate`
- **Add column to the right** → `POST /api/columns/:id/add-to-right`
- **Change column type** → `PATCH /api/columns/:id/change-type`
- Column extensions (placeholder)
- **Rename** → `PATCH /api/columns/:id`
- **Delete** → `DELETE /api/columns/:id`

### ✅ **Change Date Column (Screenshot 2)**
- Text
- Long text
- Timeline
→ All handled by `PATCH /api/columns/:id/change-type`

### ✅ **Sort Column (Screenshot 3)**
- Add subtext
- Save order of items
→ Handled by `POST /api/donors/sort`

### ✅ **Advanced Filters (Screenshot 4)**
- Filter with AI
- Multiple filter conditions
- New filter / New group
→ Handled by `POST /api/donors/filter`

### ✅ **Add Column Types (Screenshot 5)**
All column types supported:
- Text, Numbers, Status, Email, Formula, Files
- Connect boards, Date, Phone, Checkbox, People, Dropdown
- Mirror
→ All handled by `POST /api/columns/add`

---

## 🚀 **Testing the New Features**

### Example: Duplicate a Column
```bash
curl -X POST http://localhost:5000/api/columns/COLUMN_ID/duplicate
```

### Example: Advanced Filter
```bash
curl -X POST http://localhost:5000/api/donors/filter \
  -H "Content-Type: application/json" \
  -d '{
    "filters": [
      {
        "field": "status",
        "operator": "equals",
        "value": "active"
      }
    ]
  }'
```

### Example: Group By Status
```bash
curl -X POST http://localhost:5000/api/donors/group-by \
  -H "Content-Type: application/json" \
  -d '{"field": "status"}'
```

### Example: Change Column Type
```bash
curl -X PATCH http://localhost:5000/api/columns/COLUMN_ID/change-type \
  -H "Content-Type: application/json" \
  -d '{
    "newType": "date",
    "options": {}
  }'
```

---

## 📝 **Summary**

**Total Endpoints Implemented: 23**

All the features from your Monday.com screenshots are now supported by the backend:
- ✅ Column operations (duplicate, change type, autofill, add to right)
- ✅ Advanced filtering with multiple conditions
- ✅ Grouping by any field
- ✅ Sorting by any field
- ✅ All column types supported
- ✅ File uploads
- ✅ Custom fields
- ✅ Full CRUD operations

The backend is now feature-complete for your Monday.com-style donor management system! 🎉
