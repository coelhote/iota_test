// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import { Exception } from "@poppinss/utils";
import { schema } from "@ioc:Adonis/Core/Validator";
import Registration from "App/Models/Registration";
import Course from "App/Models/Course";

export default class RegistrationsController {

    public async index() {
        return await Registration.query()
    }

    public async store({ request, response }: HttpContext) {

        try {
            const validators = schema.create({
                student_id: schema.number(),
                course_id: schema.number(),
            })

            await request.validate({ schema: validators }).catch(e => {
                throw new Exception(`${e.messages.errors[0].rule} field: ${e.messages.errors[0].field}`)
            })

            const body = request.all()

            const course = await Course.findOrFail(body.course_id)

            const countRegistration = await Registration.query().where('course_id', body.course_id)
            if (countRegistration.length >= course?.max_vacancy) {
                throw new Exception('Course has no more vacancies')
            }

            const studentCourses = await Registration.query().where('student_id', body.student_id).preload('courses')

            let validateStudentShift = true

            for (let student of studentCourses) {
                let studentsCourse = await Course.find(student.course_id)

                if (studentsCourse?.shift === course.shift) {
                    validateStudentShift = false
                    break
                }
            }

            if (!validateStudentShift) {
                throw new Exception('Student cannot be on another course at the same shift')
            }

            const registration = await Registration.create(request.all())

            return registration
        } catch (err) {
            return response.status(422).json({ message: err.message })
        }
    }

    public async show({ params }: HttpContext) {
        return await Registration.find(params.id)
    }

    public async update({ params, request, response }: HttpContext) {

        try {
            let registration = await Registration.find(params.id)
            if (!registration) {
                throw new Exception('Registration not found')
            }

            await registration?.merge(request.all())
                .save()

            return registration

        } catch (err) {
            return response.status(422).json({ message: err.message })
        }

    }

    public async destroy({ params, response }: HttpContext) {
        try {
            let registration = await Registration.find(params.id)
            if (!registration) {
                throw new Exception('Registration not found')
            }

            registration?.delete()

            return response.status(200).json({ message: 'Registration deleted' })
        } catch (err) {
            return response.status(422).json({ message: err.message })
        }

    }

}
