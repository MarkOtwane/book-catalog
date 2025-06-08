export class UpdateAuthorsDto {
  name: string;
  bio: string;
  dateOfBirth: Date;
  booksWritten: {
    title: string;
    yearOfPublication: string;
    genre: string;
    isbn: string;
  }[];
}
