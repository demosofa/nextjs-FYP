import { ablyBE, isAuthentication } from "../../helpers"

function createAblyToken (req,res){
  const tokenRequest = await ablyBE.auth.createTokenRequest({clientId: req.user.id})
  res.status(200).json(tokenRequest)
}

export default isAuthentication(createAblyToken)