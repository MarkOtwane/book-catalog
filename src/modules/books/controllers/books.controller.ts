import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BooksCreateDto } from '../dtos/create.dtos';
import { BooksUpdateDto } from '../dtos/update.dtos';
import { Books } from '../interfaces/book.interface';
import { BooksService } from '../services/books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() data: BooksCreateDto): Books {
    return this.booksService.create(data);
  }

  @Get()
  findAll(): Books[] {
    return this.booksService.findAll();
  }

  @Get(':book_number')
  findOne(@Param('book_number') book_number: string): Books {
    return this.booksService.findByBookNumber(book_number);
  }

  @Get('author/:author')
  findByAuthor(@Param('author') author: string): Books {
    return this.booksService.findByAuthor(author);
  }

  @Put(':book_number')
  update(
    @Param('book_number') book_number: string,
    @Body() data: BooksUpdateDto,
  ): Books {
    return this.booksService.update(book_number, data);
  }

  @Delete('checkout/:book_number')
  remove(@Param('book_number') book_number: string): { message: string } {
    return this.booksService.remove(book_number);
  }

  @Delete(':book_number')
  delete(@Param('book_number') book_number: string): { message: string } {
    return this.booksService.delete(book_number);
  }
}
