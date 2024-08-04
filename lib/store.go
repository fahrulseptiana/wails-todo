package lib

import (
	"encoding/json"

	"github.com/oklog/ulid/v2"
	"go.etcd.io/bbolt"
)

type Data map[string]interface{}

func db() *bbolt.DB {
	conn, _ := bbolt.Open("store.db", 0600, nil)
	return conn
}

func UpdateData(bucket string, data Data) Data {
	db := db()
	defer db.Close()

	if data["Id"] == nil {
		data["Id"] = ulid.Make().String()
	}

	db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		if b == nil {
			cb, _ := tx.CreateBucket([]byte(bucket))
			b = cb
		}
		val, _ := json.Marshal(data)
		b.Put([]byte(data["Id"].(string)), val)
		return nil
	})

	return data
}

func FindAllData(bucket string) []Data {
	db := db()
	defer db.Close()

	var data []Data

	db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		if b != nil {
			b.ForEach(func(k, v []byte) error {
				var curr Data
				json.Unmarshal(v, &curr)
				data = append(data, curr)
				return nil
			})
		}
		return nil
	})

	return data
}

func FindOneData(bucket string, id string) Data {
	db := db()
	defer db.Close()

	var data Data

	db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		if b != nil {
			b.ForEach(func(k, v []byte) error {
				if string(k) == id {
					json.Unmarshal(v, &data)
				}
				return nil
			})
		}
		return nil
	})

	return data
}
