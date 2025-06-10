import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BooksCreateDto } from '../dtos/create.dtos';
import { BooksUpdateDto } from '../dtos/update.dtos';
import { Books } from '../interfaces/book.interface';
import { BooksService } from '../services/books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() data: BooksCreateDto): Promise<Books> {
    return this.booksService.create(data);
  }

  @Get()
  findAll(): Promise<Books[]> {
    return this.booksService.findAll();
  }

  @Get('book_number/:book_number')
  findOne(@Param('book_number') book_number: string): Promise<Books> {
    return this.booksService.findOne(book_number);
  }

  @Get('author/:author')
  findByAuthor(@Param('author') author: string): Promise<Books[]> {
    return this.booksService.findByAuthor(author);
  }

  @Put('book_number/:book_number')
  update(
    @Param('book_number') book_number: string,
    @Body() data: BooksUpdateDto,
  ): Promise<Books> {
    return this.booksService.update(book_number, data);
  }

  @Delete('book_number/:book_number')
  delete(
    @Param('book_number') book_number: string,
  ): Promise<{ message: string }> {
    return this.booksService.delete(book_number);
  }

  @Get('search/title')
  searchByTitle(@Query('title') title: string): Promise<Books[]> {
    return this.booksService.searchByTitle(title);
  }

  @Get('genre/:genre')
  getByGenre(@Param('genre') genre: string): Promise<Books[]> {
    return this.booksService.getBooksByGenre(genre);
  }
}
