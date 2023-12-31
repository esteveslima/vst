# vst

## Candidate notes:

- Many decisions were taken to simplify the project, as this is supposed to be a simple exercise
- The last requirement was ignored because it would probably require some sort of recurrent job to store stocks data to be able to provide the history, which wouldn't be easy to test without a proper deployment to have this running continuously
- Added below some improvements that would be required to be done in the case this was a real project

### Potential improvements:
- Enhance design and structure, as this is only simple enough to make the requirements work
- Add unit testing
- Add e2e testing
- Enhance queries/operations performance, the current ones were focused mostly to ensure security against race conditions
- Enhance input validation and error handling
- Secure the math, as there could be rouding problems along the way in the code and/or database
- Implement proper users and auth, the current concept of `user` is just a simple number representing different users


## API Docs(GraphQL)

There's a Postman collection with examples in the `/assets` folder to ease the testing

- mutation: purchaseStock(user: int, stock: string, shares: int)
  - purchase the amount of shares of a particular stock
- mutation: sellStock(user: int, stock: string, shares: int)
  - sell the amount of shares of a particular stock, if there's enough shares of it available
- query: getStocksSummary(user: int)
  - get the summary of all stocks owned by the user


## Running the project with Docker

- Ensure you have `Docker` and `docker-compose` installed
- Run one of the commands below in the root folder:
  ```
    $ make up

    or

    $ docker-compose --file ./docker-compose.yml up --detach
  ```
  - Details of services used and ports available are present in the `docker-compose.yml` file
  - The GraphQL API will be available at `localhost:8000`
  - There's an interface to manage/view the bullmq queue at `localhost:8000/queues` or `localhost:8001/queues`
- 


---
---
---
# Original Description:

---

# Backend Developer Technical Exercise

## General considerations

- ~~The api service should be written in Rust with the following requirements: Rust 1.70.0, tokio and async-graphql.~~
- ~~The event processing service should be written in Rust with the following requirements: Rust 1.70.0~~

## The problem

- You have to provide an API GraphQL service with 3 endpoints for a trading environment where a user can buy/sell stocks (market orders only), hold stocks and track portfolio performance (remember this is a virtual environment, so you don’t need to handle money whatsoever).
- Additionally, an event processing service should be provided, this service should execute the buy/sell orders independently of the API service and update the database with the fulfilled orders (**note**: any logic that persists data to a DB should be on this service).
- This two services should communicate with a message queue (ex. API service sending the order to the processing service), we use Kafka, but you can use other message broker such as RabbitMQ or Redis amongst others.
- This services and their dependencies (DB, message broker, and any other you make use of) should be Dockerized.
- Provide documentation on how to run the services and the documented API.

### 1. Buy or sell a number of shares of a certain stock via its symbol (e.g. 3 shares of COST)

- Validate that the symbol exists on the NASDAQ API and return an error if it doesn't.
- Include the ability to buy more shares of a stock you’ve previously bought (e.g. you buy 2 shares of COST in the morning and you buy 3 more shares in the afternoon).
- Save the cost basis of each executed order.

### 2. Get a list of the stocks you are holding

#### Each item of the list will have this information:
- **Profit/Loss in percentage**. Profit/Loss is how much the stock price has changed since you bought it (e.g. 10%, -7%, etc). Keep in mind that this has to be the accumulated Profit/Loss of all the shares you bought at different times/prices.
- **Share Held**. How many shares you have of this stock.
- **Current value of the shares**. If you bought 2 shares of COST, display the total value of the 2 shares.
- **Current day reference prices**. Lowest Price, Highest Price and Average price.

### 3. Get the historic price of a stock you bought in 1-hour intervals
- For example: 8:00 - 125.84, 9:00 - 123.90 (not representative of what the response should look like). 
- For this test, there are no “user accounts”, there is only one global user.

### Where to obtain the data
You can get stocks data from the NASDAQ API. This is an example API call to get information about Apple Inc. referencing it by its symbol (COST): 
https://api.nasdaq.com/api/quote/AAPL/info?assetclass=stocks

**Note**: you might have to change user agents to have a successful call to the NASDAQ api.

## Wrapping things up
We hope you can learn and have some fun solving this test and also gives you some understanding of what we want to achieve.

Thank you for your time, and effort.

----

## Glossary 
- **Share:** is a single unit in the equity of a company (e.g. 1 share of Apple, 100 shares of Google, etc.). 
- **Stock:** refers to the company shares that can be traded on the stock exchange market. In this context you can think about a stock as a company that you can buy shares of.
- **Stock exchange:** an entity that provides the means necessary to buy and sell shares of publicly traded companies.
- **Symbol:** a symbol (or stock symbol) is an acronym that represents a company in a stock market (e.g. Apple = AAPL; Tesla = TSLA; Google = GOOG, etc.).
- **Virtual trading:** any system or platform that mimics the information and behavior of trading in a stock exchange.