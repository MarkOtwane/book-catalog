import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorsDto } from '../dtos/createAuthor';
import { UpdateAuthorsDto } from '../dtos/updateAuthor';
import { Authors } from '../interfaces/authors';

@Injectable()
export class AuthorsService {
  private authors: Authors[] = [
    {
      name: 'Mark Otwane',
      bio: 'A poet a full stack web developer and designer',
      dateOfBirth: new Date('2003-10-03'),
      booksWritten: [
        {
          title: 'Think Big',
          yearOfPublication: '12-12-2023',
          genre: 'development',
          isbn: '123-345',
        },
      ],
    },
    {
      name: 'Mark Otwane',
      bio: 'A poet a full stack web developer and designer',
      dateOfBirth: new Date('2003-10-03'),
      booksWritten: [
        {
          title: 'Think Big',
          yearOfPublication: '12-12-2023',
          genre: 'development',
          isbn: '123-345',
        },
      ],
    },
  ];

  create(data: CreateAuthorsDto): Authors {
    const availableAuthor = this.authors.find(
      (author) => author.name === data.name,
    );

    if (availableAuthor) {
      throw new ConflictException(
        `Author with this name ${data.name} already exists`,
      );
    }

    const newAuthor: Authors = {
      name: data.name,
      bio: data.bio,
      dateOfBirth: data.dateOfBirth,
      booksWritten: data.booksWritten,
    };

    this.authors.push(newAuthor);
    return newAuthor;
  }

  findAll(): Authors[] {
    return this.authors;
  }

  findOne(name: string): Authors {
    const author = this.authors.find((author) => author.name === name);
    if (!author) {
      throw new ConflictException(`Author ${name} not found`);
    }
    return author;
  }

  findByname(name: string): Authors {
    const author = this.authors.find((author) => author.name === name);
    if (!author) {
      throw new ConflictException(`Author with name ${name} not found`);
    }
    return author;
  }

  update(name: string, data: UpdateAuthorsDto): Authors {
    const authorIndex = this.authors.findIndex(
      (author) => author.name === name,
    );

    if (authorIndex === -1) {
      throw new NotFoundException(`Author ${name} not found`);
    }

    if (data.name) {
      const existingAuthor = this.authors.find(
        (author) => author.name === data.name,
      );

      if (existingAuthor) {
        throw new ConflictException('Another author with this name exists');
      }
    }

    this.authors[authorIndex] = {
      ...this.authors[authorIndex],
      ...data,
    };

    return this.authors[authorIndex];
  }

  delete(name: string): { message: string } {
    const authorIndex = this.authors.findIndex(
      (author) => author.name === name,
    );

    if (authorIndex === -1) {
      throw new NotFoundException(`Author ${name} not found`);
    }

    const deletedAuthor = this.authors.splice(authorIndex, 1)[0];

    return {
      message: `Author ${deletedAuthor.name} permanently deleted`,
    };
  }
}
