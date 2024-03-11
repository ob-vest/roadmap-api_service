-- Custom SQL migration file, put you code below! --
CREATE OR REPLACE FUNCTION update_request_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE request
    SET last_activity_at = CURRENT_TIMESTAMP
    WHERE id = NEW.request_id;
    RETURN NEW;
END $$ LANGUAGE plpgsql;
--> statement-breakpoint
DO $$ BEGIN
CREATE TRIGGER trigger_update_last_activity
AFTER INSERT ON comment
FOR EACH ROW EXECUTE FUNCTION update_request_last_activity();
END $$;