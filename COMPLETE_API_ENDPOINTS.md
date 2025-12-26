# API Documentation

This document provides details on the API endpoints for managing Donors and Columns.

## Donors API (`/api/donors`)

### Get All Donors

- **Endpoint:** `GET /api/donors`
- **Description:** Retrieves a paginated list of donors. Supports searching, sorting, and filtering by status.
- **Query Parameters:**
  - `page` (number, optional, default: 1): The page number for pagination.
  - `limit` (number, optional, default: 10): The number of donors per page.
  - `search` (string, optional): A search term to filter donors by name, email, or phone.
  - `sortBy` (string, optional, default: 'createdAt'): The field to sort by.
  - `order` (string, optional, default: 'desc'): The sort order ('asc' or 'desc').
  - `status` (string, optional): Filter donors by status ('potential', 'active', 'inactive').
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Donors retrieved successfully",
    "data": {
      "donors": [
        {
          "_id": "60d0fe4f5311236168a109ca",
          "donor_name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "123-456-7890",
          "total_donated": 100,
          "total_donations": 1,
          "status": "active",
          "files": [],
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z",
          "customFields": {
            "custom_field_1": "value1"
          }
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1
      }
    }
  }
  ```

### Get Donor by ID

- **Endpoint:** `GET /api/donors/:id`
- **Description:** Retrieves a single donor by their ID.
- **Path Parameters:**
  - `id` (string, required): The ID of the donor.
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Donor retrieved successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109ca",
      "donor_name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "123-456-7890",
      "total_donated": 100,
      "total_donations": 1,
      "status": "active",
      "files": [],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "customFields": {
        "custom_field_1": "value1"
      }
    }
  }
  ```

### Create Donor

- **Endpoint:** `POST /api/donors`
- **Description:** Creates a new donor.
- **Request Body:**
  ```json
  {
    "donor_name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "098-765-4321"
  }
  ```
- **Successful Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Donor created successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "donor_name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "098-765-4321",
      "total_donated": 0,
      "total_donations": 0,
      "status": "potential",
      "files": [],
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    }
  }
  ```

### Update Donor

- **Endpoint:** `PATCH /api/donors/:id`
- **Description:** Updates an existing donor's information.
- **Path Parameters:**
  - `id` (string, required): The ID of the donor.
- **Request Body:**
  ```json
  {
    "phone": "111-222-3333",
    "status": "active"
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Donor updated successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109ca",
      "donor_name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "111-222-3333",
      "total_donated": 100,
      "total_donations": 1,
      "status": "active",
      "files": [],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-02T01:00:00.000Z"
    }
  }
  ```

### Delete Donor

- **Endpoint:** `DELETE /api/donors/:id`
- **Description:** Deletes a donor and their associated custom field values.
- **Path Parameters:**
  - `id` (string, required): The ID of the donor.
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Donor deleted successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109ca",
      "donor_name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "111-222-3333"
    }
  }
  ```

### Update Custom Field

- **Endpoint:** `PATCH /api/donors/:id/custom`
- **Description:** Updates a custom field for a specific donor.
- **Path Parameters:**
  - `id` (string, required): The ID of the donor.
- **Request Body:**
  ```json
  {
    "column_key": "custom_field_1",
    "value": "new_value"
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Custom field updated successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cc",
      "donor_id": "60d0fe4f5311236168a109ca",
      "column_key": "custom_field_1",
      "value": "new_value"
    }
  }
  ```

### Upload Donor File

- **Endpoint:** `POST /api/donors/:id/files`
- **Description:** Uploads a file associated with a donor.
- **Path Parameters:**
  - `id` (string, required): The ID of the donor.
- **Request:** `multipart/form-data` with a single file field named `file`.
- **Successful Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "File uploaded successfully",
    "data": {
      "filename": "1624399695422-document.pdf",
      "originalName": "document.pdf",
      "path": "uploads/donors/1624399695422-document.pdf",
      "mimetype": "application/pdf",
      "size": 12345
    }
  }
  ```

### Get Donor Files

- **Endpoint:** `GET /api/donors/:id/files`
- **Description:** Retrieves a list of files for a specific donor.
- **Path Parameters:**
  - `id` (string, required): The ID of the donor.
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Files retrieved successfully",
    "data": [
      {
        "filename": "1624399695422-document.pdf",
        "originalName": "document.pdf",
        "path": "uploads/donors/1624399695422-document.pdf",
        "mimetype": "application/pdf",
        "size": 12345,
        "uploadedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### Advanced Filter

- **Endpoint:** `POST /api/donors/filter`
- **Description:** Applies complex filters with multiple conditions.
- **Request Body:**
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
- **Successful Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Donors filtered successfully",
      "data": {
          "donors": [...],
          "pagination": { ... }
      }
  }
  ```

### Group By Field

- **Endpoint:** `POST /api/donors/group-by`
- **Description:** Groups donors by a specific field.
- **Request Body:**
  ```json
  {
    "field": "status"
  }
  ```
- **Successful Response (200 OK):**
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

### Sort Donors

- **Endpoint:** `POST /api/donors/sort`
- **Description:** Sorts donors by a specific field.
- **Request Body:**
  ```json
  {
    "field": "donor_name",
    "order": "asc",
    "page": 1,
    "limit": 10
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Donors sorted successfully",
      "data": {
          "donors": [...],
          "pagination": { ... }
      }
  }
  ```

## Columns API (`/api/columns`)

### Get All Columns

- **Endpoint:** `GET /api/columns`
- **Description:** Retrieves all dynamic columns.
- **Query Parameters:**
  - `includeInactive` (boolean, optional): If `true`, includes columns that are marked as inactive.
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Columns retrieved successfully",
    "data": [
      {
        "_id": "60d0fe4f5311236168a109cd",
        "column_key": "custom_field_1",
        "title": "Custom Field 1",
        "type": "text",
        "order": 1,
        "isActive": true
      }
    ]
  }
  ```

### Get Column by ID

- **Endpoint:** `GET /api/columns/:id`
- **Description:** Retrieves a single column by its `column_key`.
- **Path Parameters:**
  - `id` (string, required): The `column_key` of the column.
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Column retrieved successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cd",
      "column_key": "custom_field_1",
      "title": "Custom Field 1",
      "type": "text",
      "order": 1,
      "isActive": true
    }
  }
  ```

### Create Column

- **Endpoint:** `POST /api/columns/add`
- **Description:** Creates a new dynamic column.
- **Request Body:**
  ```json
  {
    "column_key": "new_field",
    "title": "New Field",
    "type": "number"
  }
  ```
- **Successful Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Column created successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109ce",
      "column_key": "new_field",
      "title": "New Field",
      "type": "number",
      "order": 2,
      "isActive": true
    }
  }
  ```

### Update Column

- **Endpoint:** `PATCH /api/columns/:id`
- **Description:** Updates an existing column.
- **Path Parameters:**
  - `id` (string, required): The `column_key` of the column.
- **Request Body:**
  ```json
  {
    "title": "Updated Field Title"
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Column updated successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109ce",
      "column_key": "new_field",
      "title": "Updated Field Title",
      "type": "number",
      "order": 2,
      "isActive": true
    }
  }
  ```

### Delete Column

- **Endpoint:** `DELETE /api/columns/:id`
- **Description:** Deletes a column. By default, it's a soft delete (sets `isActive` to `false`).
- **Path Parameters:**
  - `id` (string, required): The `column_key` of the column.
- **Query Parameters:**
  - `permanent` (boolean, optional): If `true`, the column and all its associated values will be permanently deleted.
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Column deactivated successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109ce",
      "column_key": "new_field",
      "title": "Updated Field Title",
      "isActive": false
    }
  }
  ```

### Reorder Columns

- **Endpoint:** `PATCH /api/columns/reorder`
- **Description:** Updates the order of multiple columns.
- **Request Body:**
  ```json
  {
    "columnOrders": [
      { "id": "60d0fe4f5311236168a109cd", "order": 2 },
      { "id": "60d0fe4f5311236168a109ce", "order": 1 }
    ]
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Columns reordered successfully",
    "data": [
      {
        "_id": "60d0fe4f5311236168a109ce",
        "column_key": "new_field",
        "order": 1
      },
      {
        "_id": "60d0fe4f5311236168a109cd",
        "column_key": "custom_field_1",
        "order": 2
      }
    ]
  }
  ```

### Duplicate Column

- **Endpoint:** `POST /api/columns/:id/duplicate`
- **Description:** Duplicates a column including all its data values.
- **Path Parameters:**
  - `id` (string, required): The `column_key` of the column to duplicate.
- **Successful Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Column duplicated successfully",
    "data": { ... }
  }
  ```

### Change Column Type

- **Endpoint:** `PATCH /api/columns/:id/change-type`
- **Description:** Changes the type of a column.
- **Path Parameters:**
  - `id` (string, required): The `column_key` of the column.
- **Request Body:**
  ```json
  {
    "newType": "date",
    "options": { ... }
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Column type changed successfully",
      "data": { ... }
  }
  ```

### Autofill Column

- **Endpoint:** `POST /api/columns/:id/autofill`
- **Description:** Fills all rows in a column with a specific value.
- **Path Parameters:**
  - `id` (string, required): The `column_key` of the column.
- **Request Body:**
  ```json
  {
    "value": "Sample Value",
    "donorIds": ["id1", "id2"]
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Autofilled 2 donors",
    "data": {
      "count": 2,
      "value": "Sample Value"
    }
  }
  ```

### Add Column to the Right

- **Endpoint:** `POST /api/columns/:id/add-to-right`
- **Description:** Adds a new column immediately to the right of the specified column.
- **Path Parameters:**
  - `id` (string, required): The `column_key` of the current column.
- **Request Body:**
  ```json
  {
    "column_key": "new_column",
    "title": "New Column",
    "type": "text"
  }
  ```
- **Successful Response (201 Created):**
  ```json
  {
      "success": true,
      "message": "Column added successfully",
      "data": { ... }
  }
  ```
