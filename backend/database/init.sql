-- TodoPro Database Initialization
-- Optimized PostgreSQL setup for Laravel application

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Optimized indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users USING btree(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verified_at ON users USING btree(email_verified_at);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks USING btree(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON tasks USING btree(is_completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks USING btree(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks USING btree(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks USING btree(created_at);

-- Full-text search index for tasks
CREATE INDEX IF NOT EXISTS idx_tasks_search ON tasks USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Performance monitoring views
CREATE OR REPLACE VIEW task_stats AS
SELECT 
    user_id,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN is_completed THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN NOT is_completed THEN 1 END) as pending_tasks,
    AVG(CASE WHEN is_completed THEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 END) as avg_completion_hours
FROM tasks 
WHERE deleted_at IS NULL
GROUP BY user_id;