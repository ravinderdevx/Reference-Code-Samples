exports = async function(arg){
  const ses = context.services.get('AmazonAWS').ses();
  return await ses.SendEmail({
    Source: arg.Source,
    Destination: { ToAddresses: arg.ToAddresses },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: arg.Body
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: arg.Subject
      }
    }
  });;
};