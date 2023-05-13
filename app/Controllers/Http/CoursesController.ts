// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import { Exception } from "@poppinss/utils";
import { schema } from "@ioc:Adonis/Core/Validator";
import Course from "App/Models/Course";
import Registration from "App/Models/Registration";

export default class CoursesController {

    public async index() {
        return await Course.query()
    }

    public async store({ request, response }: HttpContext) {

        try {
            const rules = schema.create({
                name: schema.string(),
                description: schema.string(),
                shift: schema.enum(['matutino', 'verspetino', 'noturno', 'integral'] as const),
                max_vacancy: schema.number()
            })

            await request.validate({ schema: rules }).catch(e => {
                throw new Exception(`${e.messages.errors[0].rule} field: ${e.messages.errors[0].field}`)
            })

            return await Course.create(request.all())

        } catch (err) {
            return response.status(422).json({ message: err.message })
        }

    }

    public async show({ params }: HttpContext) {
        return await Course.findOrFail(params.id)
    }

    public async update({ params, request, response }: HttpContext) {

        try {
            let course = await Course.find(params.id)

            if (!course) {
                throw new Exception('Course not found')
            }

            await course.merge(request.all()).save()

            return course

        } catch (err) {
            return response.status(422).json({ message: err.message })
        }


    }

    public async destroy({ params, response }: HttpContext) {
        try {
            let course = await Course.find(params.id)
            if (!course) {
                throw new Exception('Course not found')
            }

            let registration = await Registration.findBy('course_id', params.id)
            if (registration) {
                throw new Exception('Course with students cannot be deleted')
            }

            course?.delete()

            return response.status(200).json({ message: 'Course deleted' })
        } catch (err) {
            return response.status(400).json({ message: err.message })
        }

    }

}
