import React from 'react';

interface BookProps {
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookUrl: string;
}

const BookCard: React.FC<BookProps> = ({ bookTitle, bookAuthor, bookUrl }) => {
  return (
    <a href={bookUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
      <div className="border rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
        <h2 className="font-bold text-lg">{bookTitle}</h2>
        <p className="text-gray-700">{bookAuthor}</p>
      </div>
    </a>
  );
};

export default BookCard;
