const {
    saveBook,
    showBooks,
    showDetailBook,
    editBook,
    deleteBook
} = require('./handler')

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: saveBook
    },
    {
        method: 'GET',
        path: '/books',
        handler: showBooks
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: showDetailBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBook
    },
]

module.exports = routes