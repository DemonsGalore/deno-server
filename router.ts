import { Router } from './deps/oak.ts';

import { getUser, getUsers, addUser, updateUser, deleteUser } from './controllers/users.ts';
import { addBook, deleteBook, getBook, getBooks, updateBook } from './controllers/books.ts';
import { me, signIn } from './controllers/auth.ts';
import authMiddleware from './middleware/auth.ts';

const router = new Router();

// Auth
router.post('/signin', signIn)
    .get('/me', authMiddleware, me);

// Users
router.get('/api/users', authMiddleware, getUsers)
    .get('/api/users/:id', authMiddleware, getUser)
    .post('/api/users', authMiddleware, addUser)
    .put('/api/users/:id', authMiddleware, updateUser)
    .delete('/api/users/:id', authMiddleware, deleteUser);

// Books
router.get('/api/books', getBooks)
    .get('/api/books/:id', getBook)
    .post('/api/books', authMiddleware, addBook)
    .put('/api/books/:id', authMiddleware, updateBook)
    .delete('/api/books/:id', authMiddleware, deleteBook);

export default router;
