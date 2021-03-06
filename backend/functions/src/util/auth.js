const admin = require('firebase-admin')

// A middleware factory for checking the Firebase auth status
const validateFirebaseIdToken = function(checkRevoked=false) {
  return (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return next()
    }

    let idToken = req.headers.authorization.split('Bearer ')[1]

    const decodedIdToken = admin.auth().verifyIdToken(idToken, checkRevoked) // Verify ID token
      .then((decodedToken) => {
        req.user = decodedToken // Set the user object to the decoded JWT
        next()
      })
      .catch((err) => {
        next() // Call next without req.user
      })
  }
}

module.exports = validateFirebaseIdToken
