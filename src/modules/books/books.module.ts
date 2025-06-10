import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/connection.service';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, DatabaseService],
})
export class BooksModule {}
