# Canbus DBC visualizer
CAN Bus Visualizer is a web application tool that is designed to visualize DBC files for CAN Bus network. It provides an interface for uploading and displaying CAN messages and CAN signals from DBC files and log files. Tool is developed using Go language at the back end and Reactjs as the front end and postgreSQL for database operations which ensures a high performance and responsive tool.


## Features
- Load DBC file
- Load and Display DBC Files.
- Handling CAN log files.
- Real Time CAN Bus Data Visualization.
- User Authentication and Authorization with JWT authentication.
- Signal Selection and Filtering with radio buttons to select specific signals to visualize.
- Error Handling with failing safely mechanism and Logging.
- Back-end API Integration.
- Scalable and Extensible Architecture.

## How to run
1. Edit .env file for postgres database connection
2. Run the following command
```bash
go run main.go
```
3. At terminal web application url is shown. Open browser and go to that url.
4. Upload DBC file and CAN log file. Sample files are provided in the `sample` folder.
