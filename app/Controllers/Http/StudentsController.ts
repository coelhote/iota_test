// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import { Exception } from "@poppinss/utils";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Student from "App/Models/Student";
import Registration from "App/Models/Registration";

export default class StudentsController {

    public async index() {
        return await Student.query().preload('registration')
    }

    public async store({ request, response }: HttpContext) {

        try {
            const validators = schema.create({
                name: schema.string(),
                document: schema.string(),
                email: schema.string([rules.email()])
            })

            await request.validate({ schema: validators }).catch(e => {
                throw new Exception(`${e.messages.errors[0].rule} field: ${e.messages.errors[0].field}`)
            })

            const body = request.all()

            let studentDocument = await Student.findBy('document', body.document)
            if (studentDocument) {
                throw new Exception('Document already registrated')
            }

            let studentEmail = await Student.findBy('email', body.email)
            if (studentEmail) {
                throw new Exception('Email already registrated')
            }

            const student = await Student.create(request.all())

            return student
        } catch (err) {
            return response.status(422).json({ message: err.message })
        }


    }

    public async show({ params }: HttpContext) {
        return await Student.findOrFail(params.id)
    }

    public async update({ params, request, response }: HttpContext) {

        try {
            let student = await Student.find(params.id)
            if (!student) {
                throw new Exception('Student not found')
            }

            await student?.merge(request.all())
                .save()

            return student

        } catch (err) {
            return response.status(422).json({ message: err.message })
        }
    }

    public async destroy({ params, response }: HttpContext) {
        try {
            let student = await Student.find(params.id)
            if (!student) {
                throw new Exception('Student not found')
            }

            let registrarion = await Registration.query().where('student_id', params.id).preload('grade').first()
            if (registrarion?.grade) {
                throw new Exception('Students with grades cannot be deleted')
            }

            student?.delete()

            return response.status(200).json({ message: 'Student deleted' })
        } catch (err) {
            return response.status(400).json({ message: err.message })
        }

    }

}
