let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../cart")
chai.should();
chai.use(chaiHttp);

/**
 * Test the POST cart
 */
describe("POST /cart", () => {

   it("It should POST a cart service with valid items data", (done) => {
     const data = {
         "items": [
             {
                 "id": "milk",
                 "unitPrice": 7.01,
                 "quantity": 5
             },
             {
                 "id": "eggs",
                 "unitPrice": 10.00,
                 "quantity": 15
             },
             {
                 "id": "bread",
                 "unitPrice": 12.99,
                 "quantity": 2
             }
         ]
     };
     chai.request(server)
         .post('/cart')
         .send(data)
         .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.items.length.should.be.eq(3);
            response.body.should.have.property('items');
             response.body.should.have.property('totalPrice').eq(30);
             done();
             console.log(response.body);
         });
   });

    it("It should POST a cart service with negative unit price", (done) => {
        const data = {
            "items": [
                {
                    "id": "milk",
                    "unitPrice": -6.00,
                    "quantity": 5
                }
            ]
        };
        chai.request(server)
            .post('/cart')
            .send(data)
            .end((err, response) => {
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.items.length.should.be.eq(1);
                response.body.should.have.property('items');
                response.body.should.have.property('error').eq('Unit price cannot be negative');
                done();
                console.log(response.body);
            });
    });

    it("It should POST a cart service with invalid unit price as string", (done) => {
        const data = {
            "items": [
                {
                    "id": "milk",
                    "unitPrice": "cart",
                    "quantity": 5
                }
            ]
        };
        chai.request(server)
            .post('/cart')
            .send(data)
            .end((err, response) => {
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.items.length.should.be.eq(1);
                response.body.should.have.property('items');
                response.body.should.have.property('error').eq('Unit price should be a number');
                done();
                console.log(response.body);
            });
    });

    it("It should POST a cart service with invalid id as number", (done) => {
        const data = {
            "items": [
                {
                    "id": 12,
                    "unitPrice": 7.00,
                    "quantity": 5
                }
            ]
        };
        chai.request(server)
            .post('/cart')
            .send(data)
            .end((err, response) => {
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.items.length.should.be.eq(1);
                response.body.should.have.property('items');
                response.body.should.have.property('error').eq('Id should be a string');
                done();
                console.log(response.body);
            });
    });

    it("It should POST a cart service with invalid quantity as string", (done) => {
        const data = {
            "items": [
                {
                    "id": "milk",
                    "unitPrice": 6.00,
                    "quantity": "cart"
                }
            ]
        };
        chai.request(server)
            .post('/cart')
            .send(data)
            .end((err, response) => {
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.items.length.should.be.eq(1);
                response.body.should.have.property('items');
                response.body.should.have.property('error').eq('Quantity should be a number');
                done();
                console.log(response.body);
            });
    });

    it("It should POST a cart service with empty items", (done) => {
        const data = {
            "items": []
        };
        chai.request(server)
            .post('/cart')
            .send(data)
            .end((err, response) => {
                response.should.have.status(400);
                response.body.should.have.property('error').eq('Items are not defined');
                done();
                console.log(response.body);
            });
    });

    it("It should POST a cart service with invalid endpoint", (done) => {
        const data = {
            "items": []
        };
        chai.request(server)
            .post('/cartt')
            .send(data)
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('error').eq('Invalid endpoint');
                done();
            });
    });
});