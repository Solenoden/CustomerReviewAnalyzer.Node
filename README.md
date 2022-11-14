# CustomerReviewAnalyzer.Node

A Node API which analyzes customer reviews and returns certain metrics.

## Installation

Requirements:
 - Node v12.20.x

Steps:
1. Run `npm install`
2. Run `npm run start`
3. Access the application at `http://localhost:3000` (Postman collection is under `documentation`)

## Usage

1. Add or remove comment files under the `docs` directory (restart application each time)
2. Run the application
3. Use the Postman Collection or simply make a GET http call to: `http://localhost:3000/api/v1/report/comments?startDate=2018-01-01&endDate=2018-01-03`
4. Observe the results in the terminal and from the http call (and how they change when changing the start/end date and/or when adding/removing comments)
5. Check out the CSV file generated under the reports directory (alternatively, make a GET call to `http://localhost:3000/${FILE_NAME}`, where fileName is the file name returned from the initial http call)