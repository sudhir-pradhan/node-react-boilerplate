import base64url from 'base64url'
import { Router } from 'express'
import passport from 'passport'

import * as profilesControllers from '../controllers/profiles.controllers';

const router = new Router()

/* Not using this anywhere, just import the file to execute it and setup passport. */
import passportConfig from '../services/passport'

/* Google auth */
router.route('/google').get((req, res) => {
    /* Pass query parameters to google which it'll return to passport.
       For things like referral code or ?src=hackernews*/
    const { source } = req.query
    const state = base64url(JSON.stringify({ source }))
    console.log("[profiles.routes] Initiating google oAuth", source)

    /* Tell passport to start auth flow with GoogleStrategy.
       It'll redirect user to google's page where he gives permission to view his info.
       Scope is the list of permissions we want. */
    passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res)
})

/* After user gave me permission on google's page, Google redirects him here,
   with the code passport can use to fetch user info from google. */
router.route('/google/callback').get(passport.authenticate('google', { session:false }),
				     profilesControllers.googleLogin)




/* Email/Password auth */
const passwordAuth = passport.authenticate('local',{session:false},(err, user, info) => {
    if (err) return next(err)
    req.user = user /* Everything is successful, attach user to req and move on */
    next()
})
/* Create user with email/password, returns JWT. */
router.route('/password/signup').post(profilesControllers.passwordSignup)
/* Login with email/password, returns JWT. */
router.route('/password/login').post(passwordAuth, profilesControllers.passwordLogin)



/* JWT auth */
const jwtAuth = passport.authenticate('jwt', {session:false}, (err, user, info) => {
    if (err) return next(err)
    req.user = user /* Everything is successful, attach user to req and move on */
    next()
})

/* Return profile in exchange for JWT. */
router.route('/profile').get(jwtAuth, profilesControllers.getProfile)
/* Update profile */
router.route('/profile').post(jwtAuth, profilesControllers.updateProfile)


export default router
