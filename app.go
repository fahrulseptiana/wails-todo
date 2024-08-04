package main

import (
	"context"
	"todo/lib"

	"github.com/go-viper/mapstructure/v2"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type Todo struct {
	Id     string `mapstructure:",omitempty"`
	Todo   string
	Finish bool
}

func (a *App) GetTodos() []Todo {
	var results []Todo
	data := lib.FindAllData("todos")
	mapstructure.Decode(data, &results)
	return results
}

func (a *App) GetOneTodo(id string) Todo {
	var result Todo
	data := lib.FindOneData("todos", id)
	mapstructure.Decode(data, &result)
	return result
}

func (a *App) InsertTodo(todo string) Todo {
	var result Todo

	res := lib.UpdateData("todos", lib.Data{
		"todo": todo,
	})
	mapstructure.Decode(res, &result)

	return result
}

func (a *App) ToggleTodo(id string) Todo {
	var result Todo

	found := lib.FindOneData("todos", id)
	mapstructure.Decode(found, &result)
	if result.Id != "" {
		fin := lib.UpdateData("todos", lib.Data{
			"Id":     result.Id,
			"Todo":   result.Todo,
			"Finish": !result.Finish,
		})
		mapstructure.Decode(fin, &result)
	}

	return result
}
