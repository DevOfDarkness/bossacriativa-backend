'use strict'
const Course = use('App/Models/Course')
const Database = use('Database')

class CourseController {
    async store({ request, auth }){
        const user = await auth.getUser()
        
        const data = request.all()
        const course = Course.create(data)
        return course
    }
    async edit({ request, params, response, auth }){
        const { type, name, duration } = request.all()
        const user = auth.getUser()
        
        try{
            if(user.role != "admin"){
                throw "Error"
            }
            let course = await Course.findOrFail(params.id)
            course.type = type
            course.name = name
            course.duration = duration
            course.save()
            return course
        } catch(err){
            return response.err
        }

    }

    async index({ request }){
        const { page } = request.all()
        const courses = Database.table('courses')
        return await courses.paginate(page ? page: 1, 8)
    }
    async destroy({ params, response }){
        const course = await Course.find(params.id)
        try{
            course.delete()
            return response.status(200).send({ message: "Curso deletado"})
        } catch(err){
            return response.status(err.status).send({ error : { message: "Curso não encontrado" }})
        }
    }
}

module.exports = CourseController
