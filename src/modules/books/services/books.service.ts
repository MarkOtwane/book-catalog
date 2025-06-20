import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/connection.service';
import { BooksCreateDto } from '../dtos/create.dtos';
import { BooksUpdateDto } from '../dtos/update.dtos';
import { Books } from '../interfaces/book.interface';

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: BooksCreateDto): Promise<Books> {
    const { title, author, isbn, publication_date } = data;

    try {
      const query = `
        INSERT INTO books (title, author, isbn, publication_date)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
      `;

      const result = await this.databaseService.query(query, [
        title,
        author,
        isbn,
        publication_date,
      ]);

      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Book with the same ISBN already exists',
        );
      }
      throw new BadRequestException('Failed to create book');
    }
  }

  async findAll(): Promise<Books[]> {
    try {
      const query = 'SELECT * FROM books ';
      const result = await this.databaseService.query(query);
      console.log(result);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByAuthor(author: string): Promise<Books[]> {
    const query =
      'SELECT * FROM books WHERE author ILIKE $1 ORDER BY title ASC';
    const result = await this.databaseService.query(query, [`%${author}%`]);
    return result.rows;
  }

  async update(title: string, data: BooksUpdateDto): Promise<Books> {
    await this.findByAuthor(title);

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
      WHER = $${paramCount}
      RETURNING *
    `;

    values.push(title);

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

  async delete(id: number): Promise<{ message: string }> {
    const query = 'DELETE FROM books WHERE = $1 RETURNIN';
    const result = await this.databaseService.query(String(id));

    if (result.rows.length === 0) {
      throw new NotFoundException(`Book with  ${id} not found`);
    }

    return {
      message: `Book ${result.rows[0].id} permanently deleted`,
    };
  }

  async searchByTitle(title: string): Promise<Books[]> {
    const query = 'SELECT * FROM books WHERE title ILIKE $1 ORDER BY title ASC';
    const result = await this.databaseService.query(query, [`%${title}%`]);
    return result;
  }
}
