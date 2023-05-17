# iamqamarali/nodejs-mysql-ORM

## Introduction

A Simple ORM for Node.js and Mysql application based on [mysql2](https://github.com/sidorares/node-mysql2).

## Usage

To create a new Model create a class simply extend the class with models/BaseModel.js

```javascript
import BaseModel from './BaseModel.js'

class Comment extends BaseModel{
    static getTable(){
        return 'comments'
    }
}
```

After creating a new Model write a static function --getTable()-- which will return 
the name of the table and youre done 

## API

There are a few methods that the BaseModel provides are listed below

#### Instance Methods

```javascript
    let c = new Comment({
        body : "this is first comment",
        user_id : 2
    })

    // SAVE method updates or creates a new record if the 
    // record doesn't exist and returns id of row
    c.save()
    let comment_id = c.id


    // FIll methods updates record data in model but doesn't save it to db
    c.fill({
        // new data
    })
    c.save()

```

#### static methods

```Javascript
    // get all records
    Model.all()
    
    // get cound
    Model.count()
    
    // create new Model from data where data is an Object
    Model.create(data)

    // update a Model from data
    Model.update(id, data)

    // FIND
    // Provide id of the modal you want to find
    Model.find(2);
    // FInd also works with an object
    Model.find({
        email : "iamqamarali1@gmail.com"
    })
    // you can also pass the fields to select to find
    Model.find(query, select )


    // expects array or a single id
    Model.delete([1, 2, 4, 5])
    // or 
    Model.delete(1);

    // Deletes all rows from a table
    Model.truncate()
```
