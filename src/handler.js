const books = require('./books')
const { nanoid } = require('nanoid')

const saveBook = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    const id = nanoid(16)
    const finished = (pageCount === readPage)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    if (name == undefined || name == '') {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })

        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })

        response.code(400)
        return response
    }

    const book = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    }

    books.push(book)

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id
        }
    })
    response.code(201)
    return response
}

const showBooks = (request, h) => {
    const {
        name,
        reading,
        finished
    } = request.query

    let filteredBooks = [...books]

    if (name != null) {
        filteredBooks = filteredBooks.filter(it => it.name.toLowerCase().includes(name.toLowerCase()))
    }

    if (reading != null) {
        filteredBooks = filteredBooks.filter(it => reading == 1 ? it.reading : !it.reading)
    }

    if (finished != null) {
        filteredBooks = filteredBooks.filter(it => finished == 1 ? it.finished : !it.finished)
    }
    console.log(filteredBooks)

    const book = filteredBooks.map((it) => ({
        id: it.id,
        name: it.name,
        publisher: it.publisher
    }))

    return {
        status: 'success',
        data: {
            books: book
        }
    }
}

const showDetailBook = (request, h) => {
    const { bookId } = request.params

    const book = books.find(it => it.id == bookId)

    if (book == undefined) {
        const res = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
        res.code(404)
        return res
    }

    const res = h.response({
        status: 'success',
        data: {
            book: book
        }
    })
    res.code(200)
    return res
}

const editBook = (request, h) => {
    const { bookId } = request.params
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    const updatedAt = new Date().toISOString()

    const index = books.findIndex(it => it.id == bookId)

    if (index == -1) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        })
        res.code(404)
        return res
    }

    if (name == null) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        res.code(400)
        return res
    }

    if (readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        res.code(400)
        return res
    }

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt
    }

    const res = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    })
    res.code(200)
    return res
}

const deleteBook = (request, h) => {
    const { bookId } = request.params

    const index = books.findIndex(it => it.id == bookId)

    if (index != -1) {
        books.splice(index, 1)

        const res = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        res.code(200)
        return res
    }

    const res = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    res.code(404)
    return res
}

module.exports = {
    saveBook,
    showBooks,
    showDetailBook,
    editBook,
    deleteBook
}