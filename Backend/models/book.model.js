const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port
});

connection.connect(error => {
    if (error) throw error;
    console.log('Successfully connected to the database.');
});

const Book = function (book) {
    this.title = book.title;
    this.author = book.author;
    this.publication_year = book.publication_year;
    this.isbn = book.isbn;
    this.in_stock = book.in_stock;
};

Book.getAll = (result) => {
    connection.query("SELECT * FROM books", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("books: ", res);
        result(null, res);
    });
};

Book.findById = (id, result) => {
    connection.query(`SELECT * FROM books WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found book: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Book.create = (newBook, result) => {
    connection.query("INSERT INTO books SET ?", newBook, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created book: ", { id: res.insertId, ...newBook });
        result(null, { id: res.insertId, ...newBook });
    });
};

Book.updateById = (id, book, result) => {
    connection.query(
        "UPDATE books SET title = ?, author = ?, publication_year = ?, isbn = ?, in_stock = ? WHERE id = ?",
        [book.title, book.author, book.publication_year, book.isbn, book.in_stock, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated book: ", { id: id, ...book });
            result(null, { id: id, ...book });
        }
    );
};

Book.remove = (id, result) => {
    connection.query("DELETE FROM books WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted book with id: ", id);
        result(null, res);
    });
};

Book.removeAll = result => {
    connection.query("DELETE FROM books", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} books`);
        result(null, res);
    });
};

module.exports = Book;