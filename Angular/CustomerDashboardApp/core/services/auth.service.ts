import { Injectable } from '@angular/core';
import { Stitch, RemoteMongoClient, UserPasswordCredential, UserPasswordAuthProviderClient, CustomCredential } from 'mongodb-stitch-browser-sdk';
import { environment } from '@env/environment';
import { toObservable } from '@angular/forms/src/validators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public stitchClient: any;
  public cxmDataBase: any;

  constructor() {
    this.initalizeStitchApp();
  }

  initalizeStitchApp() {
    this.stitchClient = Stitch.initializeDefaultAppClient(environment.stitch.app_id);
    this.cxmDataBase = this.stitchClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('cxm');
  }

  login(loginModel: LoginModel)  {
    const credential = new UserPasswordCredential(loginModel.email, loginModel.password);
    return this.stitchClient.auth.loginWithCredential(credential);
  }

  // loginwithaccess() {
  //   debugger;
  //   const credential = new CustomCredential("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTMwNjQzNDksImlhdCI6MTU1MzA2MjU0OSwiaXNzIjoiNWM5MWRhOTU0ODM1NWE5NTQ2NWQ5ZGM3Iiwic3RpdGNoX2RhdGEiOm51bGwsInN0aXRjaF9kZXZJZCI6IjVjOTFjNTc3Njk5ZGJjMjZjOTUzOWY2NiIsInN0aXRjaF9kb21haW5JZCI6IjVjODdhODc0YTFkMDYxYzI5ZTZlODlmNCIsInN1YiI6IjVjOGI0ZDg0NjZlODQxMWZiMjNlNzE3ZSIsInR5cCI6ImFjY2VzcyJ9.3Z-o6_eMYsAq-cYAsPI04kqMaN4CQss0YZhVXTbwLO4");
  //   return Stitch.defaultAppClient.auth.loginWithCredential(credential)
  //   //return this.stitchClient.auth.loginWithCredential(credential);

  // // .then(authedUser => console.log(`logged in with custom auth as user ${authedUser.id}`))
  // // .catch( err => console.error(`failed to log in with custom auth: ${err}`))
  // } 

  register(registerModel: RegisterModel) {
    const emailPasswordClient = this.stitchClient.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory, "userpass");
    return emailPasswordClient.registerWithEmail(registerModel.Email, registerModel.Password);
  }

  sendResetPasswordEmail(emailModel: EmailModel) {
    const emailPasswordClient = this.stitchClient.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory, "userpass");
    return emailPasswordClient.sendResetPasswordEmail(emailModel.email);
  }

  resetPassword(newPassword: string, tokenModel: TokenModel) {
    const emailPasswordClient = this.stitchClient.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory, "userpass");

    return emailPasswordClient.resetPassword(tokenModel.token, tokenModel.tokenId, newPassword);
  }

  emailConfirmationEmail(tokenModel: TokenModel) {
    const emailPasswordClient = this.stitchClient.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory, "userpass");
    return emailPasswordClient.confirmUser(tokenModel.token, tokenModel.tokenId);
  }

  resendConfirmationEmail(emailModel: EmailModel) {
    const emailPasswordClient = this.stitchClient.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory, "userpass");
    return emailPasswordClient.resendConfirmationEmail(emailModel.email);
  }

  executeStitchFunction(name, args = []) {
    return this.stitchClient.callFunction(name, args);
  }

  logout(): void {
    this.stitchClient.auth.logout();
  }
}
