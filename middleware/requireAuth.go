package middleware

import (
	"canbus_visualizer/controllers"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

// var jwtKey = []byte("your_secret_key")

// type Claims struct {
// 	Email string `json:"email"`
// 	jwt.StandardClaims
// }

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		splits := strings.Split(tokenString, "Bearer ")
		if len(splits) != 2 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}
		tokenString = splits[1]

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		claims := &controllers.Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return controllers.JwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("email", claims.Email)
		c.Next()
	}
}

// func welcome(c *gin.Context) {
// 	username := c.MustGet("username").(string)
// 	c.JSON(http.StatusOK, gin.H{"message": "Welcome " + username})
// }
