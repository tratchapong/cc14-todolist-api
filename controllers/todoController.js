const {Todo, User, sequelize} = require('../models')

exports.getAllTodos = (req, res, next) => {
    console.log(req.user)
    const {id} = req.user
    Todo.findAll({
        // where: {userId : id}
    }).then(rs => {
        res.json(rs)
    }).catch(next)
}

// ต้องการเฉพาะ title, due_date, status
exports.getTodoById = (req, res, next) => {
    const {id} = req.params
    Todo.findAll({
        attributes: ['title', 'dueDate', 'status'],
        where : {id : id}
    }).then( rs => {
        res.json(rs)
    }).catch(next)
}

// เพิ่มข้อมูลโดยส่งมาทาง req.body 

// {
//     "title": "Learn HTML",
//     "dueDate": "2023-05-19",
//     "userId": 2
// }

exports.createTodo = (req, res, next) => {
    // validation
    Todo.create(req.body).then(rs=> {
        res.json(rs)
    }).catch(next)

}

exports.deleteTodo = (req, res, next) => {
    const {id} = req.params
    Todo.destroy({
        where : {id : id}
    }).then(rs=> {
        if (rs===0) {
            throw new Error('Cannot Delete!!')
        }
        res.json(rs)
    }).catch(next)
}

// {
//     "title": "Learn HTML",
//     "dueDate": "2023-05-19",
//     "userId": 2
// }

exports.updateTodo = (req, res, next) => {
    const {id} = req.params
    Todo.update(req.body, {
        where : { id:id}
    }).then(rs => {
        res.json(rs)
    }).catch(next)
}

// แสดง todolist จากชื่อ user
//   /user?name=Andy

exports.getTodoByUser = (req, res, next) => {
    const {name} = req.query
    User.findAll({
        attributes: {exclude: 'password'},
        where : { name : name},
        include : {
            model : Todo,
            attributes: ['title', 'dueDate', 'status', 'remainDay']
        }
    }).then(rs => {
        res.json(rs)
    }).catch(next)
}

exports.summaryTodo = (req, res, next) => {
    User.findAll({
        attributes: ['name'],
        include: {
            model : Todo,
            attributes: [ [sequelize.fn('count', sequelize.col('title')), 'tasks' ]],
        },
        group: 'user_id' 
    }).then(rs => {
        res.json(rs)
    }).catch(next)
}

exports.doubleDelete = async (req, res, next) => {
    const  {id1, id2} = req.params

    const t = await sequelize.transaction()

    try {
        let rs1 = await Todo.destroy({
            where: {id: id1},
            transaction : t
        })
            if (rs1===0)
                throw new Error('Cannot delete 1st id')
        let rs2 = await Todo.destroy({
            where: {id: id2} ,
            transaction : t
        })
            if (rs2===0)
                throw new Error('Cannot delete 2nd id')
        await t.commit()
        res.json({msg: `delete id: ${id1}, ${id2}`})
    }catch(err) {
        await t.rollback()
        console.log('rollBack...')
        next(err)
    } 
}   

exports.doubleDelete2 = (req, res, next) => {
    const {id1, id2} = req.params
    let tsc
    sequelize.transaction().then( t => {
        tsc = t
        return Todo.destroy({
            where: { id: id1 },
            transaction: tsc
        })
    }).then( rs=> {
        if (rs===0)
            throw new Error('cannot delete 1st id')
        return Todo.destroy({
            where: {id: id2},
            transaction: tsc
        })
    }).then( rs=> {
        if(rs === 0)
            throw new Error('cannot delete 2nd id')
        return tsc.commit()
    }).then( ()=> {
        res.json({msg: `delete id: ${id1}, ${id2}` })
    }).catch(err => {
        tsc.rollback().then( ()=> {
            console.log('rollBack...')
            next(err)
        })
    })
}