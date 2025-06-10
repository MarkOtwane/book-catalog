--create table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    publication_date DATE NOT NULL
);
--create indexes
CREATE INDEX idx_books_title ON books (title);
CREATE INDEX idx_books_author ON books (author);
CREATE INDEX idx_books_pub_date ON books (publication_date);
--add this column to capture the time of updating
ALTER TABLE books
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
--TRIGGER FUNCTIONS
CREATE OR REPLACE FUNCTION update_book_fields_trigger() RETURNS TRIGGER AS $$ BEGIN -- Only update updated_at if any of the watched columns have changed
    IF NEW.title IS DISTINCT
FROM OLD.title
    OR NEW.author IS DISTINCT
FROM OLD.author
    OR NEW.publication_date IS DISTINCT
FROM OLD.publication_date THEN NEW.updated_at := CURRENT_TIMESTAMP;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Attach the trigger to the books table
CREATE TRIGGER trg_update_book_fields BEFORE
UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_book_fields_trigger();
-- 2. Create trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at := CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 3. Create the trigger to call the function
CREATE TRIGGER trg_set_updated_at BEFORE
UPDATE ON books FOR EACH ROW EXECUTE FUNCTION set_updated_at();
-- --trigger function to validate date on create and update
-- CREATE TRIGGER validate_book_check_dates
--     BEFORE INSERT OR  UPDATE ON books
--     FOR EACH ROW 
--     EXECUTE FUNCTION 
--seed u user data
INSERT INTO books (title, author, isbn, publication_date)
VALUES (
        'The Pragmatic Programmer',
        'Andrew Hunt',
        '9780201616224',
        '1999-10-20'
    ),
    (
        'Clean Code',
        'Robert C. Martin',
        '9780132350884',
        '2008-08-01'
    ),
    (
        'Design Patterns',
        'Erich Gamma',
        '9780201633610',
        '1994-10-31'
    ),
    (
        'Introduction to Algorithms',
        'Thomas H. Cormen',
        '9780262033848',
        '2009-07-31'
    ),
    (
        'You Dont Know JS',
        'Kyle Simpson',
        '9781491904244',
        '2015-12-27'
    ),
    (
        'Refactoring',
        'Martin Fowler',
        '9780201485677',
        '1999-07-08'
    ),
    (
        'Code Complete',
        'Steve McConnell',
        '9780735619678',
        '2004-06-09'
    ),
    (
        'The Mythical Man-Month',
        'Frederick P. Brooks Jr.',
        '9780201835953',
        '1995-08-12'
    ),
    (
        'Effective Java',
        'Joshua Bloch',
        '9780134685991',
        '2018-01-06'
    ),
    (
        'Domain-Driven Design',
        'Eric Evans',
        '9780321125217',
        '2003-08-30'
    );