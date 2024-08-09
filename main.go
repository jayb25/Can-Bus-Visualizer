package main

import (
	"canbus_visualizer/controllers"
	"canbus_visualizer/middleware"
	"canbus_visualizer/models"
	"log"
	"net"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	var err error
	// db, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	// if err != nil {
	// 	panic("failed to connect database")
	// }

	dsn := "host=" + os.Getenv("POSTGRES_HOST") + " user=" + os.Getenv("POSTGRES_USER") + " password=" + os.Getenv("POSTGRES_PASSWORD") + " dbname=" + os.Getenv("POSTGRES_DBNAME") + " port=" + os.Getenv("POSTGRES_PORT") + " sslmode=disable TimeZone=Asia/Shanghai"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	db.AutoMigrate(&models.DBC{}, &models.User{})

	dbcHandler := controllers.NewDBCHandler(db)
	userHandler := controllers.NewUsersHandler(db)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
		AllowAllOrigins:  true,
	}))

	// react frontend dist page
	r.Use(static.Serve("/", static.LocalFile("./frontend/dist", true)))

	api := r.Group("/api")
	{
		api.POST("/users/login", userHandler.Login)
		api.POST("/users/register", userHandler.Register)
		authenticated := api.Group("/")
		authenticated.Use(middleware.AuthMiddleware())
		{
			authenticated.POST("/dbcs/upload", dbcHandler.DBCUploadFile)
			authenticated.GET("/dbcs", dbcHandler.GetAllDBC)
			authenticated.GET("/dbcs/:id", dbcHandler.GetDBC)
			authenticated.DELETE("/dbcs/:id", dbcHandler.DeleteDBC)
			authenticated.POST("/dbcs/:id/logs/upload", dbcHandler.LogUploadFile)
		}
	}

	listener, err := net.Listen("tcp", ":0")
	if err != nil {
		panic(err)
	}
	defer listener.Close()

	// Retrieve the port that was assigned
	addr := listener.Addr().(*net.TCPAddr)
	port := addr.Port

	// r.Run(":8080")
	// log.Printf("Server is running on http://localhost:%d\n", port)
	// print green color message
	log.Printf("\033[32mServer is running on http://localhost:%d\033[0m\n", port)
	r.RunListener(listener)

}
