# Site Allocation System - API Integration Plan & Prompt

This document outlines the API integration between the **Attendance System** and the **Site Allocation & Planning Grid System**. It includes a prompt that you can copy and paste to the AI working on the Site Allocation project.

---

## The Integration Strategy

The Attendance System will make an HTTP GET request to the Site Allocation System every time a worker attempts to clock in via QR code. 

**Flow:**
1. Worker scans QR code at `Branch-H` (Branch Code: `H`).
2. Attendance System extracts `employeeId` 43.
3. Attendance System calls `GET https://[site-allocation-url]/api/allocations/verify?employeeId=43&branchCode=H&date=2026-07-31`.
4. Site Allocation API returns whether the worker is allocated there on that date.
5. If `true`, the worker is clocked in. If `false`, the clock-in is denied.

---


```text
Hello! I am currently integrating this Site Allocation & Planning Grid System with our production Attendance System. 

The Attendance System needs a way to verify if a worker is actively allocated to a specific site on a specific date before allowing them to clock in via QR code.

Please create a new API endpoint in our Express backend to handle this verification.

### Endpoint Requirements:
- **Method:** `GET`
- **Route:** `/api/allocations/verify` (or similar logical route)
- **Query Parameters:**
  - `employeeId` (integer, e.g., 43)
  - `branchCode` (string, e.g., "H") - Note: This maps to our site ID/Code.
  - `date` (string, format: "YYYY-MM-DD")
- **Authentication:** The endpoint must be protected by an API Key or our standard JWT mechanism (please define an API key environment variable for service-to-service communication, e.g., `SERVICE_API_KEY`).

### Expected Response:
If the worker IS allocated to the specified branch on the specified date:
{
  "success": true,
  "allocated": true
}

If the worker IS NOT allocated, or the allocation was removed:
{
  "success": true,
  "allocated": false
}

If parameters are missing or invalid:
{
  "success": false,
  "message": "Invalid parameters"
}

### Task:
1. Please write the Express route and controller logic for this endpoint.
2. Query the database to check if a record exists matching the worker, site, and date.
3. Update the necessary documentation to reflect this new endpoint.
4. Let me know what environment variables I need to add for the `SERVICE_API_KEY`.
```
