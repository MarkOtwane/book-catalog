CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    book_number VARCHAR(50) NOT NULL UNIQUE,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(17) NOT NULL UNIQUE,
    genre VARCHAR(100) NOT NULL,
    publication_date DATE NOT NULL CHECK (publication_date <= CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_publication_date ON books(publication_date);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for books table
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO books (title, book_number, author, isbn, genre, publication_date) VALUES
    ('Rich Dad Poor Dad', 'BN-1001', 'Robert T. Kiyosaki', '978-1-61268-113-9', 'Personal Finance', '1997-04-01'),
    ('Think and Grow Rich', 'BN-1002', 'Napoleon Hill', '978-1-59330-200-9', 'Self-Help', '1937-01-01'),
    ('The 48 Laws of Power', 'BN-1003', 'Robert Greene', '978-0-14-028019-7', 'Strategy', '1998-09-01'),
    ('The Psychology of Money', 'BN-1004', 'Morgan Housel', '978-0-85719-768-9', 'Finance', '2020-09-08'),
    ('Atomic Habits', 'BN-1005', 'James Clear', '978-0-7352-1129-2', 'Self-Help', '2018-10-16'),
    ('Deep Work', 'BN-1006', 'Cal Newport', '978-1-4555-8660-3', 'Productivity', '2016-01-05'),
    ('The Power of Now', 'BN-1007', 'Eckhart Tolle', '978-1-57731-480-6', 'Spirituality', '1997-08-19'),
    ('Can’t Hurt Me', 'BN-1008', 'David Goggins', '978-1-5445-1212-9', 'Biography', '2018-12-04')
ON CONFLICT (isbn, book_number) DO NOTHING;
