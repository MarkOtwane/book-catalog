import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAuthorsDto } from '../dtos/createAuthor';
import { UpdateAuthorsDto } from '../dtos/updateAuthor';
import { Authors } from '../interfaces/authors';
import { AuthorsService } from '../services/authors.service';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  // Create a new author
  @Post()
  create(@Body() createAuthorDto: CreateAuthorsDto): Authors {
    return this.authorsService.create(createAuthorDto);
  }

  // Get all authors
  @Get()
  findAll(): Authors[] {
    return this.authorsService.findAll();
  }

  // Get a single author by name
  @Get(':name')
  findOne(@Param('name') name: string): Authors {
    return this.authorsService.findOne(name);
  }

  // Update an author by name
  @Put(':name')
  update(
    @Param('name') name: string,
    @Body() updateAuthorDto: UpdateAuthorsDto,
  ): Authors {
    return this.authorsService.update(name, updateAuthorDto);
  }

  // Delete an author (soft delete / remove)
  @Delete('remove/:name')
  remove(@Param('name') name: string): { message: string } {
    return this.authorsService.remove(name);
  }

  // Delete an author permanently
  @Delete('delete/:name')
  delete(@Param('name') name: string): { message: string } {
    return this.authorsService.delete(name);
  }
}
export { AuthorsService };
