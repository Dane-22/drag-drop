-- add_indexes.sql
-- Run this script on the worker_allocation_db to drastically improve query performance
-- for the drag-and-drop web application as the allocations table grows.

USE worker_allocation_db;

-- 1. Index for searching allocations by a specific date range (Used heavily by /api/get_data)
CREATE INDEX idx_allocation_date ON allocations(allocation_date);

-- 2. Index for filtering workers and projects
CREATE INDEX idx_worker_id ON allocations(worker_id);
CREATE INDEX idx_project_id ON allocations(project_id);

-- 3. Composite index for checking duplicates during assignment (worker + date)
CREATE INDEX idx_worker_date ON allocations(worker_id, allocation_date);

SELECT '✅ Indexes successfully added to allocations table' AS 'Status';
