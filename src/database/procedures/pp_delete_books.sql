-- Correct delete function
CREATE OR REPLACE FUNCTION pp_delete_books(
    id_p INTEGER
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM books
    WHERE id = id_p;
END;
$$ LANGUAGE plpgsql;
