import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Authors } from 'src/modules/authors/interfaces/authors';
import { CreateAuthorsDto } from '../dtos/createAuthor';
import { UpdateAuthorsDto } from '../dtos/updateAuthor';
import { AuthorsService } from '../services/authors.service';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateAuthorsDto): Authors {
    return this.authorsService.create(data);
  }

  @Get('name/:name')
  findByEmail(@Param('name') name: string): Authors {
    return this.authorsService.findByname(name);
  }

  @Patch('authorID/:authorID')
  update(
    @Param('authorID') authorID: string,
    @Body() data: UpdateAuthorsDto,
  ): Authors {
    return this.authorsService.update(authorID, data);
  }

  @Delete('name/:name')
  delete(@Param('name') name: string): void {
    this.authorsService.delete(name);
  }
}
