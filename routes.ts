import { Router } from 'https://deno.land/x/oak@v6.0.1/mod.ts';

import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from './controllers/products.ts';
import { getUser, getUsers, addUser, updateUser, deleteUser } from './controllers/users.ts';
import { signIn } from './controllers/auth.ts';

const router = new Router();

router.get('/api/products', getProducts)
    .get('/api/products/:id', getProduct)
    .post('/api/products', addProduct)
    .put('/api/products/:id', updateProduct)
    .delete('/api/products/:id', deleteProduct);

router.get('/api/users', getUsers)
    .get('/api/users/:id', getUser)
    .post('/api/users', addUser)
    .put('/api/users/:id', updateUser)
    .delete('/api/users/:id', deleteUser);

router.post('/signin', signIn);

export default router;
