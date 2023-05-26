const stripe = require('stripe');
const logger = require("../utils/logger");

const STRIPE_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTEzNjk2OSwiaWF0IjoxNjg1MTM2OTY5fQ.6RbZY1cPhXnU8vEzbgyq0HrwF4qMM5ajQmq8ZmMHHbA'

// Create a credit card for a customer within Stripe
const createCard = async (customer, cardInfo) => {
    const stripeClient = stripe.createClient(STRIPE_API_KEY)

    try {
        // TODO: Stripes API is FUCKING SHIT and doesn't strip non-digit characters from the cardInfo object
        // We need to implement that ourselves in the event client validations fail and we get bad data.
        const card = await stripeClient.customers.createSource(
            customer,
            cardInfo,
        );

        if (!card.response.status === 201) {
            logger.info("request to create card failed", card.response, cardInfo);

            throw new Error("Request failed!")
        } else {
            return card.response
        }
    } catch (e) {
       return JSON.stringify({
           error: e,
           message: e.message
       })
    }
}

// Initializes a payment and charges the payment.
const buyItem = (card, amount, email) => {
    const stripeClient = stripe.createClient(STRIPE_API_KEY)

    stripeClient.payments.initialize(
        amount,
        card,
        email
    ).then((resp) => {
        if (resp.payment.created === true) stripe.payments.charge(resp.payment.id).then((resp) => JSON.stringify(resp.status))
    }).catch((err) => {
        return JSON.stringify({
            error: err,
            message: err.message
        });
    });
}

const getTaxRate = (state) => {
    switch (state) {
        case 'CA':
            return '0.08'
        case 'TX':
            return '0.05'
        default:
            return '0.07'
    }
}

exports.createCard = createCard()
exports.buyItem = buyItem()
exports.getTaxRate = getTaxRate()
