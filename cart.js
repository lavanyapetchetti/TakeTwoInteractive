const express = require("express");
const app = express();
const bodyParser = require("body-parser")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(bodyParser.urlencoded({
    extended:true
}));

app.post('/cart', (req,res) =>{
    const cartItems = req.body;
    let sumOfItems = 0;
    try {
        if (!(cartItems === undefined || cartItems.items.length === 0)) {
            for (let i = 0; i < cartItems.items.length; i++) {
                if (typeof cartItems.items[i].unitPrice !== 'number') {
                    throw new Error("Unit price should be a number");
                }

                if (typeof cartItems.items[i].id !== 'string') {
                    throw new Error("Id should be a string");
                }

                if (typeof cartItems.items[i].quantity !== 'number') {
                    throw new Error("Quantity should be a number");
                }

                if (cartItems.items[i].unitPrice < 0) {
                    throw new Error("Unit price cannot be negative");
                }
                sumOfItems += parseFloat((cartItems.items[i].unitPrice).toFixed(2));
            }
            res.status(200).send({items: cartItems.items, totalPrice: sumOfItems});
        } else {
            throw new Error("Items are not defined")
        }
    } catch (error) {
        return res.status(400).send({items: cartItems.items, error: error.message});
    }
});

app.use((req,res) => {
    res.status(404).send({error: "Invalid endpoint"})
})

const port  = process.env.PORT || 4567;
module.exports = app.listen(port, () => console.log(`Listening on port ${port}`));

