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

  @Get('author/:author')
  findByAuthor(@Param('author') author: string): Promise<Books[]> {
    return this.booksService.findByAuthor(author);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: BooksUpdateDto,
  ): Promise<Books> {
    return this.booksService.update(String(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<{ message: string }> {
    return this.booksService.delete(id);
  }

  @Get('search/title')
  searchByTitle(@Query('title') title: string): Promise<Books[]> {
    return this.booksService.searchByTitle(title);
  }
}
