package controllers

import (
	"canbus_visualizer/models"
	"canbus_visualizer/parser"
	"encoding/csv"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"go.einride.tech/can"
	"go.einride.tech/can/pkg/descriptor"
	"gorm.io/gorm"
)

type DBCHandler struct {
	db *gorm.DB
}

func NewDBCHandler(db *gorm.DB) *DBCHandler {
	return &DBCHandler{db: db}
}

func (h *DBCHandler) GetDBC(c *gin.Context) {
	var dbc models.DBC
	if err := h.db.First(&dbc, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"dbc": dbc.JSON,
	})
}

func (h *DBCHandler) DeleteDBC(c *gin.Context) {
	if err := h.db.Delete(&models.DBC{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "DBC deleted successfully",
	})
}

func (h *DBCHandler) GetAllDBC(c *gin.Context) {
	var dbcs []models.DBC
	if err := h.db.Find(&dbcs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"dbcs": dbcs,
	})
}

func appendMessage(messages []models.Message, message models.Message) (int, []models.Message) {
	for i := 0; i < len(messages); i++ {
		if messages[i].Name == message.Name {
			return i, messages
		}
	}
	return len(messages), append(messages, message)
}

func appendSignal(signals []models.Signal, signal models.Signal) (int, []models.Signal) {
	for i := 0; i < len(signals); i++ {
		if signals[i].Name == signal.Name {
			return i, signals
		}
	}
	return len(signals), append(signals, signal)
}

func (h *DBCHandler) LogUploadFile(c *gin.Context) {
	file, err := c.FormFile("log")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	err = c.SaveUploadedFile(file, "uploads/"+file.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// get the dbc from db
	var dbc models.DBC
	if err := h.db.First(&dbc, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var dbcDatabase descriptor.Database
	if err := json.Unmarshal(dbc.JSON, &dbcDatabase); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	f, err := os.OpenFile("uploads/"+file.Filename, os.O_RDONLY, 0)
	if err != nil {
		log.Fatal(err)
	}

	// with encoding/csv
	reader := csv.NewReader(f)
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	var messages []models.Message

	for _, record := range records[1:] {
		frame := can.Frame{}
		frame.UnmarshalString(strings.ReplaceAll(record[1], " ", ""))
		for _, message := range dbcDatabase.Messages {
			if message.ID == frame.ID {
				var messageID int
				messageID, messages = appendMessage(messages, models.Message{Name: message.Name})
				for _, signal := range message.Signals {
					var signalID int
					signalID, messages[messageID].Signals = appendSignal(messages[messageID].Signals, models.Signal{Name: signal.Name})
					// fmt.Printf("%s, %v\n", record[0], signal.UnmarshalPhysical(frame.Data))
					messages[messageID].Signals[signalID].Frames = append(messages[messageID].Signals[signalID].Frames, models.Frame{
						TimeStamp:     record[0],
						PhysicalValue: signal.UnmarshalPhysical(frame.Data),
					})
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"dbcMessages": messages,
		"message":     "File uploaded successfully",
	})
}

func parseDBCFile(filePath string) (*parser.CompileResult, error) {
	// read the DBC file
	fileContent, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	result, err := parser.Compile(filePath, fileContent)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (h *DBCHandler) DBCUploadFile(c *gin.Context) {
	file, err := c.FormFile("dbc")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	err = c.SaveUploadedFile(file, "uploads/"+file.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	result, err := parseDBCFile("uploads/" + file.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	raw, err := json.Marshal(result.Database)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	dbc := models.DBC{
		JSON: raw,
	}

	if err := h.db.Create(&dbc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":      dbc.ID,
		"message": "File uploaded successfully",
	})
}
