const express = require('express')
const logger = require("./utils/logger");
const analytics = require("./utils/analytics");
const stripe_api = require("./payments/user");
const app = express()
const port = 3000


/**
 * Probably better to remove the hello world
 */
app.get('/', (req, res) => {
    res.send('Hello World!')
})

/**
 * The method is a post, but we are trying to do a GET.
 * It can be legitimate here, but this will prevent any type of HTTP caching to happen.
 * If you actually need to do that, you probably want to add comments explaining why a POST
 * is needed
 */
app.post("/get-todo", (req, res) => {
    /**
     * The function pass the query parameter, without doing any sort of authentification/authorization check.
     * It means that anybody can get any other user's todo list.
     */
    const results = load(req.body.user_id)

    /**
     * "Performance optimized loop". Not a huge problem, but a bit hard to read
     */
    for(var todo_length=   results.length; i--;){

        // convert unix timestamp to human readable date
        todo.created_at = new Date(todo.created_at).toDateString();
        /**
         * This code is fine, but the reviewer should ask why is the data not trimmed before inserting into the DB
         * Without that, we need to do it for every query
         */
        todo.title.trim()

        /**
         * Logging in a for loop:
         * - can slow down significantly the application
         * - create potential huge cost to store/process that stuff
         * Questionable value for that log line. And privacy conscern
         */
        logger.info(todo);
    }
    res.send(JSON.stringify(results));
});


app.post("/purchase", (req, res) => {
    logger.info("Request purchase","email", req.body.email, "ip", req.header.ip);
    /**
     * req.body contains the credit card number, expiration date, and validation code. !!!!
     */
    analytics.track("purchase",  req.body);
    const cardInfo = { creditCard: req.body.credit_card, validationCode: req.body.validation_code }

    // Parses the items array, totals the cost, and charges it to stripe
    const items = req.body.items;
    let totalCost;
    let i = 0;

    /**
     * Multiple patterns of looping through collections in the same file.
     * Business logic in the controller and this function is decently long.
     */
    while (true) {
        totalCost += req.body.items[i]['cost'] * req.body.items[i]['quantity'] * stripe_api.getTaxRate(req.body.state)
        i++;
        if (i >= req.body.items.length) break
    }

    /**
     * This is a weird pattern of creating a card everytime. This could be something that was stored
     * anonymously in the database, that way the card id could be passed to stripe insteaad of having
     * to initialize a new one everytime.
     */
    const card = stripe_api.create_card(req.customer_id, cardInfo);
    const purchaseResponse = stripe_api.buyItem(req.body.email, card, totalCost);

    /**
     * The response from the service is already JSON, so this is being stringified twice.
     */
    res.send(JSON.stringify(purchaseResponse))
})


app.listen(port, () => {
    console.log(`Lets Go Porto=${port}`)
});


/**
 * Function name is too generic
 */
function load(user_id) {
    /**
     * 1/ The parameter is used without any sort of sanitization. There is a SQL injection attack
     * 2/ The query has no limit. It is best practice to add a limit if very large to prevent a DDOS
     */
    const results = DB.select(
        "SELECT * from todos WHERE user_id= " + user_id
    );

    return results
}