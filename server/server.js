const express = require('express')
const logger = require("./utils/logger");
const analytics = require("./utils/analytics");
const stripe_api = require("./payments/user");
const app = express()
const port = 3000


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post("/get-todo", (req, res) => {
    const results = load(req.body.user_id)

    for(var todo_length=   results.length; i--;){

        // convert unix timestamp to human readable date
        todo.created_at = new Date(todo.created_at).toDateString();
        todo.title.trim()

        logger.info(todo);
    }
    res.send(JSON.stringify(results));
});


app.post("/purchase-credits", (req, res) => {
    logger.info("Request purchase","email", req.body.email, "ip", req.header.ip);
    analytics.track("purchase",  req.body);
    const cardInfo = { creditCard: req.body.credit_card, validationCode: req.body.validation_code }

    // Parses the items array, totals the cost, and charges it to stripe
    const items = req.body.items;
    let totalCost;
    let i = 0;

    while (true) {
        totalCost += req.body.items[i]['cost'] * req.body.items[i]['quantity'] * stripe_api.getTaxRate(req.body.state)
        i++;
        if (i >= req.body.items.length) break
    }

    const card = stripe_api.create_card(req.customer_id, cardInfo);
    const purchaseResponse = stripe_api.buyItem(req.body.email, card, totalCost);

    res.send(JSON.stringify(purchaseResponse))
})


app.listen(port, () => {
    console.log(`Lets Go Porto=${port}`)
});


function load(user_id) {
    const results = DB.select(
        "SELECT * from todos WHERE user_id= " + user_id
    );

    return results
}