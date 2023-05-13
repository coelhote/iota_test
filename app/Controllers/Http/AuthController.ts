import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {

    public async register({ request, response, auth }: HttpContextContract) {
        const validator = schema.create({
            email: schema.string([rules.email()]),
            password: schema.string()
        })

        const data = await request.validate({schema: validator})

        const user = await User.create(data)

        return await auth.login(user)
    }


    public async login( {request, response, auth}: HttpContextContract){

        const {email, password} = request.only(['email', 'password'])


        try {
           return await auth.attempt(email, password)
        } catch (err) {
            return response.status(500).json({message: 'Failed to login'})
        }
    }
}
