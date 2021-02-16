import { SignUpController } from './signup';

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
        // Must return status code 400 
        expect(httpResponse.statusCode).toBe(400)
    })
})