import { SignUpController } from './signup';
import { MissingParamError } from '../errors/missing-param-error';

describe('SignUp Controller', () => { // Controller name being tested
    test('Should return 400 if no name is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        // Expect return status code 400 
        expect(httpResponse.statusCode).toBe(400) // toBe: Checks whether the value data in the object is identical
        expect(httpResponse.body).toEqual(new MissingParamError('name')) // toEqual: Checks if the values ​​are equal 
    })

    test('Should return 400 if no email is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400) 
        expect(httpResponse.body).toEqual(new MissingParamError('email')) 
    })
})