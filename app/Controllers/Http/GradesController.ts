// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import { Exception } from "@poppinss/utils";
import { schema } from "@ioc:Adonis/Core/Validator";
import Grade from "App/Models/Grade";

export default class GradesController {

    public async index() {
        return await Grade.query()
    }

    public async store({ request, response }: HttpContext) {

        try {
            const validators = schema.create({
                registration_id: schema.number(),
                grade: schema.number(),
            })

            await request.validate({ schema: validators }).catch(e => {
                throw new Exception(`${e.messages.errors[0].rule} field: ${e.messages.errors[0].field}`)
            })

            const grade = await Grade.create(request.all())

            return grade
        } catch (err) {
            return response.status(422).json({ message: err.message })
        }


    }

    public async show({ params }: HttpContext) {
        return await Grade.find(params.id)
    }

    public async update({ params, request, response }: HttpContext) {

        try {
            let grade = await Grade.find(params.id)
            if (!grade) {
                throw new Exception('Grade not found')
            }

            await grade?.merge(request.all())
                .save()

            return grade
        } catch (err) {
            return response.status(422).json({ message: err.message })
        }
    }

    public async destroy({ params, response }: HttpContext) {
        try {
            let grade = await Grade.find(params.id)
            if (!grade) {
                throw new Exception('Grade not found')
            }

            grade?.delete()

            return response.status(200).json({ message: 'Grade deleted' })
        } catch (err) {
            return response.status(400).json(err)
        }

    }

}
