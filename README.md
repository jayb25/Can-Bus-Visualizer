# Canbus DBC visualizer
This is a simple web application tool to visualize the DBC file for CAN bus messages. It is written in Golang.

## Features
- Load DBC file
- Display messages and signals
- Load CAN log file
- Display plot of signals

## How to run
1. Edit .env file for postgres database connection
2. Run the following command
```bash
go run main.go
```
3. At terminal web application url is shown. Open browser and go to that url.
4. Upload DBC file and CAN log file. Sample files are provided in the `sample` folder.