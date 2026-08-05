# Database Schema Reference

The system uses a MySQL database (`worker_allocation_db`). Below are the primary tables to be aware of:

## `allocations`
Tracks the assignment of a worker to a specific project on a specific day.
- `id` (int, PK)
- `worker_id` (int, FK)
- `project_id` (int, FK)
- `day_of_week` (enum: Monday-Sunday)
- `allocation_date` (date)
- `status` (enum: assigned, completed, pending)
- `assigned_by` (varchar)

## `employees`
Contains all worker/employee information.
- `id` (int, PK)
- `employee_code` (varchar)
- `first_name`, `last_name` (varchar)
- `position` (varchar)
- `status` (varchar, e.g., 'Active')
- `daily_rate` (decimal)
- `branch_id` (int)
