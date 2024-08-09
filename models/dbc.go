package models

import (
	"encoding/json"
	"time"
)

type DBC struct {
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `gorm:"index"`
	JSON      json.RawMessage
}

type Message struct {
	Name    string
	Signals []Signal
}

type Signal struct {
	Name   string
	Frames []Frame
}

type Frame struct {
	TimeStamp     string
	PhysicalValue float64
}
