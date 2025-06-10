/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { BooksCreateDto } from '../dtos/create.dtos';
import { BooksUpdateDto } from '../dtos/update.dtos';
import { Books } from '../interfaces/book.interface';

@Injectable()
export class BooksService {
  constructor(private databaseService: DatabaseService) {}

  async create(data: BooksCreateDto): Promise<Books> {
    const { title, book_number, author, isbn, genre, publication_Date } = data;

    try {
      const query = `
        INSERT INTO books (title, book_number, author, isbn, genre, publication_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const result = await this.databaseService.query(query, [
        title,
        book_number,
        author,
        isbn,
        genre,
        publication_Date,
      ]);

      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Book with the same ISBN or book number already exists',
        );
      }
      throw new BadRequestException('Failed to create book');
    }
  }

  async findAll(): Promise<Books[]> {
    try {
      const query = 'SELECT * FROM books ORDER BY created_at DESC';
      const result = await this.databaseService.query(query);
      return result.rows;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve books');
    }
  }

  async findOne(book_number: string): Promise<Books> {
    const query = 'SELECT * FROM books WHERE book_number = $1';
    const result = await this.databaseService.query(query, [book_number]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Book with number ${book_number} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result.rows[0];
  }

  async findByAuthor(author: string): Promise<Books[]> {
    const query =
      'SELECT * FROM books WHERE author ILIKE $1 ORDER BY title ASC';
    const result = await this.databaseService.query(query, [`%${author}%`]);
    return result.rows;
  }

  async update(book_number: string, data: BooksUpdateDto): Promise<Books> {
    await this.findOne(book_number);

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const query = `
      UPDATE books
      SET ${updateFields.join(', ')}
      WHERE book_number = $${paramCount}
      RETURNING *
    `;

    values.push(book_number);

    try {
      const result = await this.databaseService.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Another book with this ISBN or book number already exists',
        );
      }
      throw new BadRequestException('Failed to update book');
    }
  }

  async delete(book_number: string): Promise<{ message: string }> {
    const query =
      'DELETE FROM books WHERE book_number = $1 RETURNING book_number';
    const result = await this.databaseService.query(query, [book_number]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Book with number ${book_number} not found`);
    }

    return {
      message: `Book ${result.rows[0].book_number} permanently deleted`,
    };
  }

  async searchByTitle(title: string): Promise<Books[]> {
    const query = 'SELECT * FROM books WHERE title ILIKE $1 ORDER BY title ASC';
    const result = await this.databaseService.query(query, [`%${title}%`]);
    return result.rows;
  }

  async getBooksByGenre(genre: string): Promise<Books[]> {
    const query = 'SELECT * FROM books WHERE genre ILIKE $1 ORDER BY title ASC';
    const result = await this.databaseService.query(query, [`%${genre}%`]);
    return result.rows;
  }
}
