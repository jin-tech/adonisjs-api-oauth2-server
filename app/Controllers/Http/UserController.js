'use strict'

const User = use('App/Models/User');

class UserController {

    async index({ request, response, auth, view }) {

        const format = request.header('accept', '')
        const users = await User.all()

        if (format === 'application/json') {
            return users
        } else {
            return view.render('users.list', { users: users.toJSON() })
        }
    }

    async info ({ request, response, auth, view }) {

        const format = request.header('accept', '')
        const user = auth.user;
        console.log(user);
        if (format === 'application/json') {
            return user
        } else {
            return view.render('users.view', { user: user.toJSON() })
        }
      }

    async create({ request, response, auth }) {
        const user = await User.create(request.only(['username', 'email', 'password']));

        await auth.login(user);
        return response.redirect('/');
    }

    // async login({ request, auth, response, session }) {
    //     const { email, password } = request.all();

    //     try {
    //         await auth.attempt(email, password);
    //         return response.redirect('/');
    //     } catch (error) {
    //         session.flash({ loginError: 'These credentials do not work.' })
    //         return response.redirect('/login');
    //     }
    // }

    async login ({ request, auth, response , session}) {
        try {
            const { email, password, rememberMe } = request.all();
   
            // validate the user credentials and generate a JWT token
            await auth.attempt(email, password);
    
        } catch (error) {
    
            session.flashExcept(['password'])
            session.flash({ error: 'We cannot find any account with these credentials.' })
           return response.redirect('login')
        }

        /**
         * We are authenticated.
         */
        return response.redirect('/')
    }
}

module.exports = UserController
