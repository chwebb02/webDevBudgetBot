const service = require('./service');
const express = require('express');
const path = require('path');
const app = express();
const Transaction = require('./models/transactionModel');
const BudgetItem = require('./models/budgetItemModel');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE"
    );
    next();
});

app.listen(8080);

// Define api here
app.post('/user/register', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(400).send('Username and password are required');
        return
    }

    try {
        const userId = await service.register(username, password);
        res.status(200).send(userId);
    } catch (err) {
        let code = 500;
        if (err.message === "Username already exists") { code = 409; }

        res.status(code).send(err.message);
    }
});

app.post('/user/login', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(400).send('Username and password are required');
        return
    }

    try {
        const userId = await service.login(username, password);
        res.status(200).send(userId);
    } catch (err) {
        let code = 500;
        if      (err.message === "User does not exist") { code = 404; }
        else if (err.message === "Bad login") { code = 401; }

        res.status(code).send(err.message);
    }
});

app.post('/transaction/create', async (req, res) => {
    const transaction = new Transaction(req.body);
    if (!transaction) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const savedTransaction = await service.createTransaction(transaction);
        res.status(200).send(savedTransaction);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
});

app.get('/user/:userId/transactions', async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const transactions = await service.getUserTransactions(userId);
        res.status(200).send(transactions);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
});

app.get('/transaction/:transactionId', async (req, res) => {
    const transactionId = req.params.transactionId;
    if (!transactionId) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const transaction = await service.getTransactionById(transactionId);
        res.status(200).send(transaction);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
});

app.put('/transaction', async (req, res) => {
    const transaction = new Transaction(req.body);
    if (!transaction) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const updatedTransaction = await service.updateTransaction(transaction);
        res.status(200).send(updatedTransaction);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
});

app.delete('/transaction/:transactionId', async (req, res) => {
    const transactionId = req.params.transactionId;
    if (!transactionId) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const removeTransaction = await service.deleteTransaction(transactionId);
        res.status(200).send(removeTransaction);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
})


app.post('/budgetItem/create', async (req, res) => {
    const budgetItem = new BudgetItem(req.body);
    if (!budgetItem) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const savedBudgetItem = await service.createBudgetItem(budgetItem);
        res.status(200).send(savedBudgetItem);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
});

app.get('/user/:userId/budgetItems', async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const budgetItems = await service.getUserBudgetItems(userId);
        res.status(200).send(budgetItems);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
});

app.get('/budgetItem/:budgetItemId', async (req, res) => {
    const budgetItemId = req.params.budgetItemId;
    if (!budgetItemId) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const budgetItem = await service.getBudgetItemById(budgetItemId);
        res.status(200).send(budgetItem);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
});

app.put('/budgetItem', async (req, res) => {
    const budgetItem = new BudgetItem(req.body);
    if (!budgetItem) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const updatedBudgetItem = await service.updateBudgetItem(budgetItem);
        res.status(200).send(updatedBudgetItem);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
});

app.delete('/budgetItem/:budgetItemId', async (req, res) => {
    const budgetItemId = req.params.budgetItemId;
    if (!budgetItemId) {
        res.status(400).send('Malformed request');
        return
    }

    try {
        const removeBudgetItem = await service.deleteBudgetItem(budgetItemId);
        res.status(200).send(removeBudgetItem);
    } catch (err) {
        let code = 500;

        res.status(code).send(err.message);
    }
})
