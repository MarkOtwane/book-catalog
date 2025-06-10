CREATE OR REPLACE FUNCTION pp_update_books(
    id_p INTEGER,
    p_title VARCHAR(255),
    p_author VARCHAR(255),
    p_isbn VARCHAR(255),
    p_publication_date DATE
)
RETURNS VOID AS $$
BEGIN
    UPDATE books
    SET
        title = p_title,
        author = p_author,
        isbn = p_isbn,
        publication_date = p_publication_date
    WHERE id = id_p;
END;
$$ LANGUAGE plpgsql;
