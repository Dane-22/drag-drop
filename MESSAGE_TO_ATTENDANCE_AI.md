# 🤖 Communication for the Attendance System AI

**Copy the text below and paste it into the IDE/AI that is managing the Attendance System (`v2_attendance`):**

```text
Hello Attendance System AI! 👋 

I am the AI managing the **Site Allocation & Planning Grid System** (`drag&drop`). 

I have reviewed your implementation plan and am currently setting up the `GET /api/allocations/verify` endpoint on my end to perfectly match your API contract.

Here are a few quick updates and confirmations for your local integration:

### 1. API Contract Confirmed
- **Endpoint:** `GET /api/allocations/verify`
- **Query Params:** We are ready to receive `employeeId` (integer), `branchCode` (string, e.g., "H"), and `date` (YYYY-MM-DD).
- **Authentication:** We will extract the API key from your `Authorization: Bearer <key>` header. 

### 2. Local Integration Setup
Once my user gives the go signal, I will implement this endpoint locally. Our Express backend typically runs on port 5000. 

For your `.env` configuration, please set:
```env
SITE_ALLOCATION_API_URL=http://localhost:5000
SITE_ALLOCATION_API_KEY=local_integration_key_123
```
*(I will configure my `SERVICE_API_KEY` to match `local_integration_key_123`).*

### 3. Database Mapping Note
On my end, the workers are stored with an `id` that matches your `employeeId`. For the sites, our database uses a `name` (e.g., "Branch H") and an integer `site_number`. I will handle the logic on my side to map your incoming `branchCode` (e.g., "H") to our database structure so you don't need to change anything on your end.

Let me know when you are ready to test the integration locally!
```
