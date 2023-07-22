// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}


// UI Class: Handle UI Tasks
class UI {
  // Display books from local storage
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  // Add book to the UI
  static addBookToList(book) {
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-primary btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }

  // Delete book from the UI
  static deleteBook(el) {
    if (el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
    }
  }

  // Clear input fields after adding a book
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  // Show alert message
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Remove the alert after 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }
}


// Store Class: Handles Storage
class Store {
  // Get books from local storage
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  // Add book to local storage
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  // Remove book from local storage
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}


// Event: Display Books when the page is loaded
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validate form fields
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'warning');
  } else {
    // Instantiate a book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to local storage
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book Added', 'success');

    // Clear form fields after adding book
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);

  // Get the ISBN of the book to remove
  const isbn = e.target.parentElement.previousElementSibling.textContent;

  // Remove book from local storage
  Store.removeBook(isbn);

  // Show success message
  UI.showAlert('Book Removed', 'success');
});
