CREATE OR REPLACE FUNCTION pp_create_book(
    p_title VARCHAR(255),
    p_author VARCHAR(255),
    p_isbn VARCHAR(255),
    p_publication_date DATE
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO books (title, author, isbn, publication_date)
    VALUES (p_title, p_author, p_isbn, p_publication_date);
END;
$$ LANGUAGE plpgsql;
 